import { Reveal } from '../components/Reveal'
import { ExpandingCta, PageHero } from '../components/Blocks'
import { EVENTS } from '../content'

export default function Events() {
  return (
    <div className="page">
      <PageHero
        eyebrow="Events"
        title={['Workshops, trips,', 'and nights out.']}
        lead="What’s coming up this semester."
      />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container events">
          {EVENTS.map((e, i) => (
            <Reveal key={e.title} className="event" delay={i * 80}>
              <div className="event__date">
                {e.day}
                <small>{e.weekday}</small>
              </div>
              <div>
                <span className="tag">{e.type}</span>
                <h3 className="event__title">{e.title}</h3>
                <p className="muted">{e.text}</p>
              </div>
              <div className="event__arrow" aria-hidden="true">→</div>
            </Reveal>
          ))}
        </div>
      </section>
      <ExpandingCta title={['Don’t just watch.', 'Join in.']} sub="Members get first access to every workshop and trip." />
    </div>
  )
}
