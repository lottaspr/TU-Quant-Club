import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Lines, Reveal } from '../components/Reveal'
import { HorizontalScroll, Statement, Ticker } from '../components/Scroll'
import { BellBars, Heatmap, LiveDistribution, PriceLine } from '../components/Charts'
import { ExpandingCta, Stats } from '../components/Blocks'
import { useInView, useScrollProgress } from '../hooks/scroll'
import { Orb } from '../components/Orb'
import type { OrbState } from 'thinking-orbs/engine'
import { COHORT } from '../content'

const OFFERS = [
  {
    title: 'Workshops & Lectures',
    text: 'Explore fundamentals and advanced topics in trading and quantitative research, from practitioners and peers.',
    c: '#2e5ae4',
    orb: 'listening' as OrbState,
    tint: undefined,
  },
  {
    title: 'Quantitative Research',
    text: 'Work in small teams on original research: backtests, risk models, and market microstructure studies.',
    c: '#1f9e89',
    orb: 'searching' as OrbState,
    tint: '#35b779',
  },
  {
    title: 'Social Events',
    text: 'Trips, case competitions, and socials throughout the semester. We work hard, and we play hard.',
    c: '#fde725',
    orb: 'connecting' as OrbState,
    tint: '#fde725',
  },
  {
    title: 'Industry Network',
    text: 'Talks, office visits and recruiting nights with our partner firms, so you see how it is done for real.',
    c: '#442572',
    orb: 'weaving' as OrbState,
    tint: '#2e5ae4',
  },
]

const PILLARS = [
  {
    title: 'Science',
    text: 'As STEM students, our perspective is understanding how systems work. We go deep into physics, mathematics, and computer science together.',
    c: '#2e5ae4',
  },
  {
    title: 'Markets',
    text: 'Financial markets aren’t as distant from daily life as they seem. We use systematic models not to predict outcomes, but to navigate their uncertainty.',
    c: '#63ce59',
  },
  {
    title: 'Community',
    text: 'Work hard, play hard. The hours we put into research deserve to be matched by trips, dinners, and nights we actually look forward to.',
    c: '#ffe323',
  },
]

function Tile({ title, text, children, delay }: { title: string; text: string; children: React.ReactNode; delay: number }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.25)
  return (
    <div ref={ref} className={`tile ${inView ? 'is-in' : ''}`} data-reveal style={{ '--delay': `${delay}ms` } as React.CSSProperties}>
      <div className="tile__viz">{children}</div>
      <div>
        <h3 className="h3" style={{ fontSize: 22, marginBottom: 6 }}>{title}</h3>
        <p className="muted">{text}</p>
      </div>
    </div>
  )
}

export default function Home() {
  const hero = useRef<HTMLElement>(null)
  useScrollProgress(hero, 'leave')

  return (
    <div className="page">
      <section ref={hero} className="hero">
        <div className="orb" />
        <div className="container hero__content">
          <Reveal as="span" className="eyebrow">{COHORT} · Applications open</Reveal>
          <Lines as="h1" className="display" lines={['We bridge the gap', 'between STEM and', 'financial markets.']} base={100} />
          <div className="hero__top">
            <Reveal as="p" className="lead" delay={500}>
              A student society in Munich where mathematicians, physicists and computer scientists learn to think
              like quants, through research, mentorship and real markets.
            </Reveal>
            <Reveal className="hero__ctas" delay={650}>
              <Link to="/apply" className="btn btn--primary">
                Apply now <span className="arrow">→</span>
              </Link>
              <Link to="/about" className="btn btn--ghost">Learn more</Link>
            </Reveal>
          </div>
          <Reveal delay={800}>
            <LiveDistribution />
          </Reveal>
        </div>
      </section>

      <Ticker
        items={['Monte Carlo', 'Black–Scholes', 'Stochastic calculus', 'Order books', 'PCA', 'Market microstructure', 'Risk models', 'Backtesting']}
      />

      <Statement
        text="Financial markets aren’t as distant from daily life as they seem. We use systematic models not to predict outcomes, but to navigate their uncertainty."
        highlight={['systematic', 'uncertainty']}
      />

      <HorizontalScroll
        header={
          <div className="head" style={{ marginBottom: 0 }}>
            <Lines lines={['What we do']} className="h2" />
            <Reveal as="p" className="lead" delay={150}>Four ways in. Most members end up doing all of them.</Reveal>
          </div>
        }
      >
        {OFFERS.map((o, i) => (
          <article className="hcard" key={o.title}>
            <div className="hcard__glow" style={{ background: o.c }} />
            <div className="hcard__top">
              <span className="hcard__num">0{i + 1}</span>
              <Orb state={o.orb} size={240} color={o.tint} className="hcard__orb" />
            </div>
            <div>
              <h3 className="h3">{o.title}</h3>
              <p className="muted" style={{ maxWidth: '38ch' }}>{o.text}</p>
            </div>
          </article>
        ))}
      </HorizontalScroll>

      <section className="section">
        <div className="container">
          <div className="head">
            <Lines lines={['How we think']} className="h2" />
            <Reveal as="p" className="lead" delay={150}>A glimpse of the models and visuals that shape our research.</Reveal>
          </div>
          <div className="tiles">
            <Tile title="Correlation" text="How assets move together across market regimes." delay={0}>
              <Heatmap />
            </Tile>
            <Tile title="Probability" text="Distributions, not predictions. We model what’s likely." delay={120}>
              <BellBars />
            </Tile>
            <Tile title="Price action" text="Volatility is data, not drama." delay={240}>
              <PriceLine />
            </Tile>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="head">
            <Lines lines={['Our culture']} className="h2" />
          </div>
          <div className="pillars">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} className="pillar" delay={i * 150} style={{ '--c': p.c } as React.CSSProperties}>
                <h3 className="h3">{p.title}</h3>
                <p className="muted">{p.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Stats />

      <ExpandingCta
        title={['Applications for', 'Cohort 07 are open.']}
        sub="Oct 1 – 28 · No finance background required."
      />
    </div>
  )
}
