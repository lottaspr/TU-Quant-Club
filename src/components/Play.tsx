import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../hooks/scroll'
import { VIRIDIS } from '../content'

const STOPS = VIRIDIS.map((h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)])

/** Continuous viridis colour for t in [0, 1]. */
function viridisRGB(t: number, alpha = 1) {
  const x = Math.min(1, Math.max(0, t)) * (STOPS.length - 1)
  const i = Math.min(STOPS.length - 2, Math.floor(x))
  const f = x - i
  const a = STOPS[i]
  const b = STOPS[i + 1]
  return `rgba(${Math.round(a[0] + (b[0] - a[0]) * f)},${Math.round(a[1] + (b[1] - a[1]) * f)},${Math.round(a[2] + (b[2] - a[2]) * f)},${alpha})`
}

/** Sets up a DPR-aware canvas that tracks its container size and runs `frame` while on screen. */
function useCanvasLoop(
  frame: (ctx: CanvasRenderingContext2D, w: number, h: number, dt: number) => void,
  onResize?: (w: number, h: number) => void,
) {
  const ref = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(frame)
  const resizeRef = useRef(onResize)
  frameRef.current = frame
  resizeRef.current = onResize

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let w = 0
    let h = 0
    const size = () => {
      const r = canvas.getBoundingClientRect()
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      w = r.width
      h = r.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      resizeRef.current?.(w, h)
    }
    size()
    const ro = new ResizeObserver(size)
    ro.observe(canvas)

    let raf = 0
    let visible = false
    let last = performance.now()
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      frameRef.current(ctx, w, h, dt)
      if (visible) raf = requestAnimationFrame(loop)
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      cancelAnimationFrame(raf)
      if (visible) {
        last = performance.now()
        raf = requestAnimationFrame(loop)
      }
    })
    io.observe(canvas)
    frameRef.current(ctx, w, h, 0)
    return () => {
      ro.disconnect()
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [])
  return ref
}

type Pointer = { x: number; y: number; active: boolean; speed: number }

function usePointer(target: React.RefObject<HTMLElement | null>) {
  const p = useRef<Pointer>({ x: 0, y: 0, active: false, speed: 0 })
  useEffect(() => {
    const el = target.current
    if (!el) return
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      p.current.speed = Math.hypot(x - p.current.x, y - p.current.y)
      p.current.x = x
      p.current.y = y
      p.current.active = true
    }
    const leave = () => {
      p.current.active = false
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerdown', move)
    el.addEventListener('pointerleave', leave)
    el.addEventListener('pointercancel', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerdown', move)
      el.removeEventListener('pointerleave', leave)
      el.removeEventListener('pointercancel', leave)
    }
  }, [target])
  return p
}

/* ------------------------------------------------------------------ */
/* Volatility surface: cells dodge the cursor, shocks mean-revert.     */
/* ------------------------------------------------------------------ */

export function VolField() {
  const wrap = useRef<HTMLDivElement>(null)
  const pointer = usePointer(wrap)
  const [vol, setVol] = useState(12)
  const state = useRef({
    cell: 26,
    cols: 0,
    rows: 0,
    shock: new Float32Array(0),
    ox: new Float32Array(0),
    oy: new Float32Array(0),
    vx: new Float32Array(0),
    vy: new Float32Array(0),
    t: 0,
    ripples: [] as { x: number; y: number; age: number }[],
    tick: 0,
  })
  const still = prefersReducedMotion()

  const canvas = useCanvasLoop(
    (ctx, w, h, dt) => {
      const s = state.current
      const p = pointer.current
      if (!still) s.t += dt
      ctx.clearRect(0, 0, w, h)
      const R = Math.max(90, Math.min(w, h) * 0.3)
      const gap = 3
      const offX = (w - s.cols * s.cell) / 2
      const offY = (h - s.rows * s.cell) / 2
      let total = 0

      s.ripples = s.ripples.filter((r) => (r.age += dt) < 1.6)

      for (let r = 0; r < s.rows; r++) {
        for (let c = 0; c < s.cols; c++) {
          const k = r * s.cols + c
          const cx = offX + c * s.cell + s.cell / 2
          const cy = offY + r * s.cell + s.cell / 2

          let tx = 0
          let ty = 0
          let near = 0
          if (p.active) {
            const dx = cx - p.x
            const dy = cy - p.y
            const d = Math.hypot(dx, dy) || 1
            if (d < R) {
              near = (1 - d / R) ** 2
              tx = (dx / d) * near * R * 0.35
              ty = (dy / d) * near * R * 0.35
              s.shock[k] += near * (0.035 + Math.min(p.speed, 60) * 0.0015)
            }
          }
          for (const rp of s.ripples) {
            const d = Math.hypot(cx - rp.x, cy - rp.y)
            const front = rp.age * 520
            const band = Math.max(0, 1 - Math.abs(d - front) / 40)
            s.shock[k] += band * 0.06 * (1 - rp.age / 1.6)
          }

          // damped spring back to the grid, shock decays (mean reversion)
          s.vx[k] = (s.vx[k] + (tx - s.ox[k]) * 0.16) * 0.74
          s.vy[k] = (s.vy[k] + (ty - s.oy[k]) * 0.16) * 0.74
          s.ox[k] += s.vx[k]
          s.oy[k] += s.vy[k]
          s.shock[k] = Math.min(1.2, s.shock[k] * 0.962)
          total += s.shock[k]

          const base =
            0.24 +
            0.14 * Math.sin(c * 0.21 + s.t * 0.5) * Math.cos(r * 0.33 - s.t * 0.35) +
            0.08 * Math.sin((c + r) * 0.11 - s.t * 0.25)
          const v = base + s.shock[k]
          const scale = 1 - near * 0.55
          const size = (s.cell - gap) * scale
          ctx.fillStyle = viridisRGB(v)
          ctx.beginPath()
          ctx.roundRect(cx + s.ox[k] - size / 2, cy + s.oy[k] - size / 2, size, size, Math.min(4, size / 4))
          ctx.fill()
        }
      }

      if (++s.tick % 10 === 0) {
        const avg = total / Math.max(1, s.cols * s.rows)
        setVol(Math.round(12 + avg * 260))
      }
    },
    (w, h) => {
      const s = state.current
      s.cell = w < 600 ? 20 : 26
      s.cols = Math.floor(w / s.cell)
      s.rows = Math.floor(h / s.cell)
      const n = s.cols * s.rows
      s.shock = new Float32Array(n)
      s.ox = new Float32Array(n)
      s.oy = new Float32Array(n)
      s.vx = new Float32Array(n)
      s.vy = new Float32Array(n)
    },
  )

  const click = (e: React.PointerEvent) => {
    const r = e.currentTarget.getBoundingClientRect()
    state.current.ripples.push({ x: e.clientX - r.left, y: e.clientY - r.top, age: 0 })
  }

  const regime = vol < 18 ? 'Calm' : vol < 32 ? 'Nervous' : 'Crisis'
  return (
    <div className="play">
      <div ref={wrap} className="play__stage play__stage--field" onPointerDown={click}>
        <canvas ref={canvas} className="play__canvas" aria-label="Interactive volatility heatmap" role="img" />
      </div>
      <div className="play__bar">
        <span className="play__hint">Move across the grid to shock the market. Click to send a wave.</span>
        <span className="play__readout">
          Implied vol <b>{vol}%</b>
          <i className={`play__pill play__pill--${regime.toLowerCase()}`}>{regime}</i>
        </span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Monte Carlo lab: cursor x sets volatility, cursor y sets drift.     */
/* ------------------------------------------------------------------ */

const PATHS = 70
const STEPS = 120

function seededNormals(n: number, seed: number) {
  let s = seed
  const rand = () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
  const out = new Float32Array(n)
  for (let i = 0; i < n; i++) out[i] = Math.sqrt(-2 * Math.log(rand() + 1e-12)) * Math.cos(2 * Math.PI * rand())
  return out
}

export function MonteCarloLab() {
  const wrap = useRef<HTMLDivElement>(null)
  const pointer = usePointer(wrap)
  const z = useRef(seededNormals(PATHS * STEPS, 20191))
  const params = useRef({ mu: 0.08, sigma: 0.25, t: 0 })
  const [read, setRead] = useState({ mu: 0.08, sigma: 0.25, up: 0.5 })
  const tick = useRef(0)

  const canvas = useCanvasLoop((ctx, w, h, dt) => {
    const pr = params.current
    const p = pointer.current
    pr.t += dt
    const plotW = w * (w < 600 ? 0.74 : 0.8)
    const histX = plotW + 16
    const pad = 16

    let tMu: number
    let tSigma: number
    if (p.active) {
      tSigma = 0.05 + Math.min(1, Math.max(0, p.x / plotW)) * 0.65
      tMu = 0.45 - Math.min(1, Math.max(0, p.y / h)) * 0.9
    } else {
      tSigma = 0.25 + Math.sin(pr.t * 0.4) * 0.12
      tMu = 0.08 + Math.sin(pr.t * 0.27) * 0.12
    }
    pr.sigma += (tSigma - pr.sigma) * 0.12
    pr.mu += (tMu - pr.mu) * 0.12

    const lo = Math.log(0.3)
    const hi = Math.log(3.2)
    const yOf = (s: number) => pad + (1 - (Math.log(s) - lo) / (hi - lo)) * (h - pad * 2)
    const dtS = 1 / STEPS
    const drift = (pr.mu - (pr.sigma * pr.sigma) / 2) * dtS
    const vol = pr.sigma * Math.sqrt(dtS)

    ctx.clearRect(0, 0, w, h)

    // grid + S0 line
    ctx.strokeStyle = 'rgba(154,147,173,0.14)'
    ctx.lineWidth = 1
    ctx.font = '11px Helvetica Neue, Helvetica, Arial, sans-serif'
    ctx.fillStyle = 'rgba(154,147,173,0.8)'
    for (const lvl of [0.5, 1, 2]) {
      const y = yOf(lvl)
      ctx.beginPath()
      ctx.setLineDash(lvl === 1 ? [] : [3, 5])
      ctx.moveTo(0, y)
      ctx.lineTo(plotW, y)
      ctx.stroke()
      ctx.fillText(`${lvl}× S₀`, 6, y - 6)
    }
    ctx.setLineDash([])

    const ends: number[] = []
    for (let i = 0; i < PATHS; i++) {
      let x = 0
      for (let j = 0; j < STEPS; j++) x += drift + vol * z.current[i * STEPS + j]
      ends.push(Math.exp(x))
    }
    const order = ends.map((_, i) => i).sort((a, b) => ends[a] - ends[b])
    const rankOf = new Float32Array(PATHS)
    order.forEach((idx, r) => (rankOf[idx] = r / (PATHS - 1)))

    for (let i = 0; i < PATHS; i++) {
      const rank = rankOf[i]
      ctx.strokeStyle = viridisRGB(0.1 + rank * 0.9, 0.55)
      ctx.lineWidth = 1.1
      ctx.beginPath()
      let x = 0
      ctx.moveTo(0, yOf(1))
      for (let j = 0; j < STEPS; j++) {
        x += drift + vol * z.current[i * STEPS + j]
        ctx.lineTo(((j + 1) / STEPS) * plotW, yOf(Math.exp(x)))
      }
      ctx.stroke()
    }

    // terminal distribution
    const bins = 28
    const counts = new Array(bins).fill(0)
    for (const s of ends) {
      const b = Math.floor(((Math.log(Math.min(3.19, Math.max(0.301, s))) - lo) / (hi - lo)) * bins)
      counts[b]++
    }
    const maxC = Math.max(...counts)
    const bh = (h - pad * 2) / bins
    for (let b = 0; b < bins; b++) {
      const len = (counts[b] / maxC) * (w - histX - 8)
      ctx.fillStyle = viridisRGB(b / (bins - 1), 0.9)
      ctx.fillRect(histX, pad + (bins - 1 - b) * bh + 1, len, bh - 2)
    }

    if (p.active) {
      ctx.strokeStyle = 'rgba(255,255,255,0.35)'
      ctx.beginPath()
      ctx.moveTo(p.x, 0)
      ctx.lineTo(p.x, h)
      ctx.moveTo(0, p.y)
      ctx.lineTo(plotW, p.y)
      ctx.stroke()
    }

    if (++tick.current % 8 === 0) {
      setRead({
        mu: pr.mu,
        sigma: pr.sigma,
        up: ends.filter((s) => s > 1).length / PATHS,
      })
    }
  })

  return (
    <div className="play">
      <div ref={wrap} className="play__stage play__stage--mc">
        <canvas ref={canvas} className="play__canvas" aria-label="Interactive Monte Carlo simulation" role="img" />
      </div>
      <div className="play__bar">
        <span className="play__hint">Hover the chart: left to right raises volatility σ, bottom to top raises drift μ.</span>
        <span className="play__readout">
          Drift μ <b>{(read.mu * 100).toFixed(0)}%</b> Vol σ <b>{(read.sigma * 100).toFixed(0)}%</b> Chance of gain{' '}
          <b>{Math.round(read.up * 100)}%</b>
        </span>
      </div>
    </div>
  )
}
