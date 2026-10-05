import { useEffect, useMemo, useState } from 'react'
import { prefersReducedMotion, useInView } from '../hooks/scroll'
import { viridis } from '../content'

const gauss = (x: number, mu: number, s: number) => Math.exp(-((x - mu) ** 2) / (2 * s * s))

function barColor(t: number) {
  if (t > 0.9) return '#ffe323'
  if (t > 0.72) return '#63ce59'
  if (t > 0.18) return '#2e5ae4'
  return '#442572'
}

/** Animated histogram that re-samples every few seconds, like a live model. */
export function LiveDistribution({ bars = 48 }: { bars?: number }) {
  const [params, setParams] = useState({ mu: 0, sigma: 1 })
  useEffect(() => {
    if (prefersReducedMotion()) return
    const id = setInterval(() => {
      setParams({ mu: (Math.random() - 0.5) * 0.9, sigma: 0.8 + Math.random() * 0.45 })
    }, 1800)
    return () => clearInterval(id)
  }, [])
  const heights = useMemo(
    () =>
      Array.from({ length: bars }, (_, i) => {
        const x = (i / (bars - 1)) * 6.4 - 3.2
        return gauss(x, params.mu, params.sigma) * (0.92 + Math.random() * 0.08)
      }),
    [bars, params],
  )
  return (
    <div>
      <div className="dist" aria-hidden="true">
        {heights.map((h, i) => (
          <span key={i} style={{ height: `${Math.max(1.5, h * 100)}%`, background: barColor(h) }} />
        ))}
      </div>
      <div className="dist-caption">
        <span>Live probability model. Not predicting the market, just understanding it.</span>
        <span>
          μ <b>{params.mu.toFixed(2)}</b>&nbsp;&nbsp;σ <b>{params.sigma.toFixed(2)}</b>
        </span>
      </div>
    </div>
  )
}

/** Correlation-style heatmap that slowly drifts between regimes. */
export function Heatmap() {
  const cols = 12
  const rows = 8
  const make = () =>
    Array.from({ length: rows * cols }, (_, k) => {
      const r = Math.floor(k / cols)
      const c = k % cols
      const band = gauss(r, rows / 2 - 0.5, 1.6) * 0.7
      return Math.min(1, band + Math.random() * 0.45 + (c / cols) * 0.15)
    })
  const [cells, setCells] = useState(make)
  useEffect(() => {
    if (prefersReducedMotion()) return
    const id = setInterval(() => setCells(make), 2600)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="heat" aria-hidden="true">
      {cells.map((v, i) => (
        <span key={i} style={{ background: viridis(v), transitionDelay: `${(i % cols) * 30}ms` }} />
      ))}
    </div>
  )
}

export function BellBars() {
  const n = 21
  return (
    <svg viewBox="0 0 210 120" preserveAspectRatio="none" aria-hidden="true">
      {Array.from({ length: n }, (_, i) => {
        const h = gauss(i, (n - 1) / 2, 3.4)
        const height = 8 + h * 108
        return (
          <rect
            key={i}
            className="fill-in"
            style={{ transitionDelay: `${0.2 + Math.abs(i - 10) * 0.05}s` }}
            x={i * 10 + 1}
            y={120 - height}
            width={8}
            height={height}
            rx={1.5}
            fill={viridis(h)}
          />
        )
      })}
    </svg>
  )
}

function seededWalk(seed: number, n: number, drift = 0, vol = 1) {
  let s = seed
  const rand = () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
  const out = [0]
  for (let i = 1; i < n; i++) {
    const z = Math.sqrt(-2 * Math.log(rand() + 1e-9)) * Math.cos(2 * Math.PI * rand())
    out.push(out[i - 1] + drift + vol * z)
  }
  return out
}

export function PriceLine() {
  const pts = useMemo(() => seededWalk(42, 60, 0.08, 1), [])
  const min = Math.min(...pts)
  const max = Math.max(...pts)
  const xy = pts.map((v, i) => [(i / (pts.length - 1)) * 300, 110 - ((v - min) / (max - min)) * 95])
  const d = xy.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  return (
    <svg viewBox="0 0 300 120" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="pl-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#35b779" stopOpacity="0.45" />
          <stop offset="1" stopColor="#442572" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="pl-line" x1="0" x2="1">
          <stop offset="0" stopColor="#2e5ae4" />
          <stop offset="0.6" stopColor="#35b779" />
          <stop offset="1" stopColor="#fde725" />
        </linearGradient>
      </defs>
      <path className="fill-in" d={`${d} L300,120 L0,120 Z`} fill="url(#pl-fill)" />
      <path
        className="draw"
        pathLength={1}
        d={d}
        fill="none"
        stroke="url(#pl-line)"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

/** Monte Carlo paths of a geometric Brownian motion, drawn on scroll. */
export function MonteCarlo({ paths = 36 }: { paths?: number }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.25)
  const data = useMemo(() => {
    const walks = Array.from({ length: paths }, (_, k) => seededWalk(7 + k * 131, 80, 0.02, 0.16))
    const finals = walks.map((w) => w[w.length - 1])
    const lo = Math.min(...walks.flat())
    const hi = Math.max(...walks.flat())
    const fmin = Math.min(...finals)
    const fmax = Math.max(...finals)
    return walks.map((w) => ({
      d: w
        .map((v, i) => `${i ? 'L' : 'M'}${((i / (w.length - 1)) * 600).toFixed(1)},${(220 - ((v - lo) / (hi - lo)) * 200).toFixed(1)}`)
        .join(' '),
      c: viridis(0.15 + ((w[w.length - 1] - fmin) / (fmax - fmin)) * 0.85),
    }))
  }, [paths])
  return (
    <div ref={ref} className={`mc ${inView ? 'is-in' : ''}`}>
      <svg viewBox="0 0 600 230" aria-hidden="true">
        {data.map((p, i) => (
          <path
            key={i}
            className="draw"
            pathLength={1}
            d={p.d}
            fill="none"
            stroke={p.c}
            strokeWidth="1.2"
            strokeOpacity="0.85"
            style={{ transitionDelay: `${i * 35}ms` }}
          />
        ))}
      </svg>
      <div className="mc__meta">
        <span>Monte Carlo · PCA · Black–Scholes</span>
        <span>{paths} simulated paths</span>
      </div>
    </div>
  )
}
