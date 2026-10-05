import { useRef, useState } from 'react'
import { Lines, Reveal } from '../components/Reveal'
import { ExpandingCta, PageHero } from '../components/Blocks'
import { useScrollProgress, clamp } from '../hooks/scroll'
import { APPLY_URL, CLUB, EMAIL } from '../content'
import { Orb } from '../components/Orb'
import type { OrbState } from 'thinking-orbs/engine'

const STEPS = [
  { orb: 'composing' as OrbState, title: 'Apply', when: 'Oct 1 – 28', text: 'Submit a short form. CV optional, curiosity required.' },
  { orb: 'listening' as OrbState, title: 'Interview', when: 'Oct 30 – Nov 1', text: 'A relaxed 20-minute conversation with two board members.' },
  { orb: 'solving' as OrbState, title: 'Decision', when: 'By Nov 15', text: 'We get back to everyone within a week of their interview.' },
  { orb: 'connecting' as OrbState, title: 'Onboard', when: 'Late November', text: 'Meet your cohort and pick your first workshop or research track.' },
]

const FAQ = [
  {
    q: 'Do I need a finance background?',
    a: 'No. Most members study mathematics, physics, computer science or engineering. We teach the finance; you bring the curiosity.',
  },
  {
    q: 'Do I need to know how to code?',
    a: 'It helps, but it isn’t required. Our Intro to Python for Quant Finance workshop is built for members starting from zero.',
  },
  {
    q: 'How much time does it take?',
    a: 'Plan for a workshop or meeting most weeks, plus whatever research project you choose to join.',
  },
  {
    q: 'Who can apply?',
    a: 'Students at Munich universities, from any semester. STEM backgrounds are our focus, but strong motivation counts most.',
  },
  {
    q: 'I have another question.',
    a: `Write to us at ${EMAIL} and someone from the board will get back to you.`,
  },
]

export default function Apply() {
  const tl = useRef<HTMLDivElement>(null)
  const [p, setP] = useState(0)
  useScrollProgress(tl, 'enter', (v) => {
    const q = clamp((v - 0.3) / 0.5)
    tl.current?.style.setProperty('--p', q.toFixed(4))
    setP(q)
  })
  return (
    <div className="page">
      <PageHero
        eyebrow="Cohort 07"
        title={['Apply to', `${CLUB}.`]}
        lead="Applications are open Oct 1 – 28. No finance background required, just genuine curiosity."
      >
        <Reveal delay={650}>
          <a href={APPLY_URL} className="btn btn--primary">
            Start application <span className="arrow">→</span>
          </a>
        </Reveal>
      </PageHero>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="head">
            <Lines lines={['How it works']} className="h2" />
            <Reveal as="p" className="lead" delay={150}>Four steps from application to your first workshop.</Reveal>
          </div>
          <div ref={tl} className="timeline">
            <div className="timeline__rail"><i /></div>
            {STEPS.map((s, i) => (
              <Reveal key={s.title} className={`step ${p >= i / STEPS.length + 0.02 ? 'on' : ''}`} delay={i * 120}>
                <div className="step__head">
                  <span className="step__num">0{i + 1}</span>
                  <Orb state={s.orb} size={64} />
                </div>
                <div>
                  <h3 className="h3" style={{ marginBottom: 8 }}>{s.title}</h3>
                  <p className="muted">{s.text}</p>
                </div>
                <div className="step__when">{s.when}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container split">
          <div className="split__label">
            <Lines lines={['Questions']} className="h2" />
          </div>
          <Reveal className="faq">
            {FAQ.map((f) => (
              <details key={f.q}>
                <summary>
                  {f.q}
                  <i aria-hidden="true" />
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </Reveal>
        </div>
      </section>

      <ExpandingCta title={['Ready when', 'you are.']} sub="Applications close Oct 28." cta="Start application" to="/apply" />
    </div>
  )
}
