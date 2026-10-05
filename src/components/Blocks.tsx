import { useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Lines, Reveal } from './Reveal'
import { Counter } from './Scroll'
import { clamp, useScrollProgress } from '../hooks/scroll'
import { STATS } from '../content'
import { Logo } from './Logo'

export function Stats() {
  return (
    <section className="container" style={{ padding: 'clamp(48px, 8vw, 120px) var(--gutter)' }}>
      <div className="stats">
        {STATS.map((s) => (
          <div className="stat" key={s.label}>
            <div className="stat__num">
              <Counter to={s.value} pad={s.pad} suffix={s.suffix} plain={s.plain} />
            </div>
            <div className="stat__label">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

/** Gradient panel that grows from an inset card to full-bleed as it scrolls in. */
export function ExpandingCta({ title, sub, cta = 'Apply now', to = '/apply' }: { title: string[]; sub: string; cta?: string; to?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useScrollProgress(ref, 'enter', (p) => ref.current?.style.setProperty('--p', clamp((p - 0.15) / 0.65).toFixed(4)))
  return (
    <section className="cta">
      <div ref={ref} className="cta__panel">
        <div className="cta__grid" />
        <Reveal className="cta__logo">
          <Logo size={72} mono />
        </Reveal>
        <span className="eyebrow" style={{ color: '#fff', position: 'relative' }}>Cohort 07</span>
        <Lines lines={title} className="h1" />
        <Reveal as="p" className="lead" delay={200} style={{ color: 'rgba(255,255,255,.8)', position: 'relative' }}>
          {sub}
        </Reveal>
        <Reveal delay={300}>
          <Link to={to} className="btn btn--primary">
            {cta} <span className="arrow">→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

export function PageHero({ eyebrow, title, lead, aside, children }: { eyebrow: string; title: string[]; lead?: string; aside?: ReactNode; children?: ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  useScrollProgress(ref, 'leave')
  return (
    <section ref={ref} className="hero hero--page">
      <div className="orb" />
      {aside && <div className="hero__aside">{aside}</div>}
      <div className="container hero__content">
        <Reveal as="span" className="eyebrow">{eyebrow}</Reveal>
        <Lines as="h1" lines={title} className="display" base={100} />
        {lead && (
          <div className="hero__top">
            <Reveal as="p" className="lead" delay={500}>{lead}</Reveal>
            {children}
          </div>
        )}
      </div>
    </section>
  )
}
