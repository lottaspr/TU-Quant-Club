import { useEffect, useRef, useState, type ReactNode } from 'react'
import { clamp, useInView, useScrollProgress } from '../hooks/scroll'
import { Orb } from './Orb'
import type { OrbState } from 'thinking-orbs/engine'

/** Pinned paragraph whose words light up as you scroll through it. */
export function Statement({ text, highlight = [], orb = 'searching' }: { text: string; highlight?: string[]; orb?: OrbState }) {
  const ref = useRef<HTMLElement>(null)
  const words = text.split(' ')
  const [lit, setLit] = useState(0)
  useScrollProgress(ref, 'pin', (p) => setLit(Math.round(clamp(p * 1.15) * words.length)))
  return (
    <section ref={ref} className="statement">
      <div className="statement__sticky">
        <div className="container statement__grid">
          <p className="statement__text">
            {words.map((w, i) => (
              <span
                key={i}
                className={`w ${i < lit ? 'on' : ''} ${highlight.some((h) => w.toLowerCase().startsWith(h)) ? 'hl' : ''}`}
              >
                {w}{' '}
              </span>
            ))}
          </p>
          <div className="statement__orb">
            <Orb state={orb} size={520} />
          </div>
        </div>
      </div>
    </section>
  )
}

/** Vertical scroll drives a horizontal track while the section is pinned. */
export function HorizontalScroll({ header, children }: { header: ReactNode; children: ReactNode }) {
  const outer = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number | undefined>()

  useEffect(() => {
    const measure = () => {
      const t = track.current
      if (!t) return
      const overflow = t.scrollWidth - window.innerWidth
      setHeight(window.innerHeight + Math.max(0, overflow))
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (track.current) ro.observe(track.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  useScrollProgress(outer, 'pin', (p) => {
    const t = track.current
    if (!t || window.innerWidth <= 760) return
    const overflow = Math.max(0, t.scrollWidth - window.innerWidth)
    t.style.transform = `translate3d(${-p * overflow}px,0,0)`
  })

  return (
    <section ref={outer} className="hscroll" style={{ height }}>
      <div className="hscroll__sticky">
        <div className="container">{header}</div>
        <div ref={track} className="hscroll__track">
          {children}
        </div>
      </div>
    </section>
  )
}

/** Number that counts up the first time it is seen. */
export function Counter({ to, pad = 0, suffix = '', plain = false }: { to: number; pad?: number; suffix?: string; plain?: boolean }) {
  const [ref, inView] = useInView<HTMLSpanElement>(0.5)
  const [v, setV] = useState(plain ? to - 30 : 0)
  useEffect(() => {
    if (!inView) return
    const from = plain ? to - 30 : 0
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1600)
      const e = 1 - Math.pow(1 - t, 4)
      setV(Math.round(from + (to - from) * e))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to, plain])
  return (
    <span ref={ref}>
      {String(v).padStart(pad, '0')}
      {suffix}
    </span>
  )
}

export function Ticker({ items }: { items: string[] }) {
  const all = [...items, ...items]
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__track">
        {all.map((t, i) => (
          <span key={i}>{t}</span>
        ))}
      </div>
    </div>
  )
}
