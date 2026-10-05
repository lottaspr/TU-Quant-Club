import { useEffect, useRef } from 'react'
import { MODE_FRAMES, paintFrame, resolvePreset, STATE_TO_MODE, type OrbState } from 'thinking-orbs/engine'
import type { ModeOpts } from 'thinking-orbs/engine'
import { prefersReducedMotion } from '../hooks/scroll'

function hexToRgb(hex: string) {
  const n = parseInt(hex.replace('#', ''), 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

type Props = {
  state: OrbState
  /** Rendered size in CSS px. Large sizes use the engine's 300pt-tuned defaults. */
  size: number
  color?: string
  speed?: number
  opts?: ModeOpts
  className?: string
  label?: string
}

/**
 * Dotted "thinking orb" from the thinking-orbs engine (MIT, Jakub Antalik),
 * painted on our own canvas so it can render far larger than the 64px component.
 */
export function Orb({ state, size, color, speed = 1, opts, className, label }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    canvas.width = Math.round(size * dpr)
    canvas.height = Math.round(size * dpr)

    const mode = STATE_TO_MODE[state]
    const preset = size <= 64 ? resolvePreset(state, size <= 20 ? 20 : size <= 32 ? 32 : 64) : null
    const baseOpts = { ...(preset?.opts ?? {}), ...opts }
    const rate = (preset?.speed ?? 1) * speed
    const tint = color ? hexToRgb(color) : undefined
    const frameFn = MODE_FRAMES[mode]

    const draw = (t: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, size, size)
      paintFrame(ctx, frameFn(size, t, baseOpts), true, tint)
    }

    if (prefersReducedMotion()) {
      draw(2)
      return
    }

    let raf = 0
    let visible = false
    let last = performance.now()
    let t = Math.random() * 10
    const loop = (now: number) => {
      t += ((now - last) / 1000) * rate
      last = now
      draw(t)
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
    draw(t)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [state, size, color, speed, opts])

  return (
    <canvas
      ref={ref}
      className={className}
      role="img"
      aria-label={label ?? `${state} animation`}
      style={{ width: size, height: size, maxWidth: '100%', aspectRatio: '1' }}
    />
  )
}
