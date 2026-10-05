import { Lines, Reveal } from '../components/Reveal'
import { MonteCarlo } from '../components/Charts'
import { ExpandingCta, PageHero, Stats } from '../components/Blocks'
import { Statement } from '../components/Scroll'
import { CLUB } from '../content'

export default function About() {
  return (
    <div className="page">
      <PageHero
        eyebrow="About us"
        title={['Where curiosity', 'meets quantitative', 'finance.']}
        lead={`${CLUB} introduces STEM students to the practical side of mathematics in financial markets.`}
      />

      <section className="section">
        <div className="container split">
          <div className="split__label">
            <Lines lines={['How it', 'started']} className="h2" />
          </div>
          <div>
            <Reveal className="split__body">
              <p>
                It started with one question from a co-founder: could the systematic nature of financial markets
                make our investment decisions better?
              </p>
              <p className="muted">
                That question led us into Monte Carlo simulations, principal component analysis and the
                Black–Scholes model, and it hasn’t stopped since.
              </p>
            </Reveal>
            <MonteCarlo />
          </div>
        </div>
      </section>

      <Statement
        text="The next generation of quants will come from students who engage with markets creatively and critically. We’re building the room where that happens."
        highlight={['creatively', 'critically.']}
      />

      <section className="section">
        <div className="container split">
          <div className="split__label">
            <span className="eyebrow">Our mission</span>
          </div>
          <Reveal className="split__body">
            <p>
              Through workshops, lectures and group cases, we turn abstract mathematics into practical tools. We go
              beyond coursework and encourage members to take on research that bridges science and finance, and to
              publish what they find.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container split">
          <div className="split__label">
            <span className="eyebrow">Our vision</span>
          </div>
          <Reveal className="split__body">
            <p>
              We believe curiosity and collaboration build better quants than credentials do. We keep the environment
              rigorous, open and intellectually generous, so every member pushes the boundaries of what they
              understand.
            </p>
          </Reveal>
        </div>
      </section>

      <Stats />

      <ExpandingCta title={['Think like a quant.', 'Start here.']} sub="Applications for Cohort 07 are open until Oct 28." />
    </div>
  )
}
