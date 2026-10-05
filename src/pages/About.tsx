import { Lines, Reveal } from '../components/Reveal'
import { MonteCarloLab } from '../components/Play'
import { ExpandingCta, PageHero, Stats } from '../components/Blocks'
import { Statement } from '../components/Scroll'
import { CLUB } from '../content'
import { Logo } from '../components/Logo'

export default function About() {
  return (
    <div className="page">
      <PageHero
        eyebrow="About us"
        title={['Where curiosity', 'meets quantitative', 'finance.']}
        lead={`${CLUB} is a student society that introduces STEM students to the practical applications of mathematics in financial markets through an engaging series of workshops, lectures, and group cases.`}
        aside={<Logo size={300} className="hero__logo" />}
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
            <Reveal className="about-lab" delay={120}>
              <div className="about-lab__label">
                <span className="eyebrow">Monte Carlo · PCA · Black–Scholes</span>
              </div>
              <MonteCarloLab />
            </Reveal>
          </div>
        </div>
      </section>

      <Statement
        text="We firmly believe that the next generation of Quants, those who revolutionize quantitative finance, emerges from the brilliance of students who creatively and critically engage with financial markets."
        highlight={['creatively', 'critically']}
        orb="connecting"
      />

      <section className="section">
        <div className="container split">
          <div className="split__label">
            <span className="eyebrow">Our mission</span>
          </div>
          <Reveal className="split__body">
            <p>
              Our mission extends beyond academic excellence as we aim to empower our members to excel in all fields.
              To foster their growth, we actively encourage them to delve into cutting-edge research topics that
              bridge the worlds of science and finance, inspiring them to contribute thought-provoking articles.
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
              We foster curiosity and innovation by nurturing a collaborative and intellectually stimulating
              environment. Our collective pursuit of knowledge and transformative impact propels us towards uncharted
              horizons, driving us to push the boundaries of understanding.
            </p>
          </Reveal>
        </div>
      </section>

      <Stats />

      <ExpandingCta title={['Think like a quant.', 'Start here.']} sub="Applications for Cohort 07 are open until Oct 28." />
    </div>
  )
}
