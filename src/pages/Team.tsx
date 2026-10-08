import { Reveal } from '../components/Reveal'
import { ExpandingCta, PageHero } from '../components/Blocks'
import { FlipCard } from '../components/FlipCard'
import { CLUB, EMAIL, TEAM } from '../content'

const initials = (role: string) =>
  role
    .split(' ')
    .filter((w) => w !== 'of')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)

export default function Team() {
  return (
    <div className="page">
      <PageHero
        eyebrow="The team"
        title={['People behind', `${CLUB}.`]}
        lead="A student-run board, re-elected every year."
      />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container team">
          {TEAM.map((m, i) => (
            <Reveal key={m.role} className="member" delay={(i % 4) * 100} style={{ '--c': m.c } as React.CSSProperties}>
              <FlipCard
                label={`${m.role}, hover or tap to flip`}
                front={
                  <>
                    <div className="member__photo">
                      <span className="member__initials">{initials(m.role)}</span>
                    </div>
                    <div className="member__info">
                      <div className="member__name">Member Name</div>
                      <div className="member__role">{m.role}</div>
                    </div>
                  </>
                }
                back={
                  <>
                    <span className="eyebrow">Member Name</span>
                    <div className="member__back-role">{m.role}</div>
                    <p className="member__about">{m.about}</p>
                    <div className="member__links" onPointerUp={(e) => e.stopPropagation()}>
                      <a href="#" onClick={(e) => e.preventDefault()}>
                        LinkedIn
                      </a>
                      <a href={`mailto:${EMAIL}`}>Email</a>
                    </div>
                  </>
                }
              />
            </Reveal>
          ))}
        </div>
      </section>
      <ExpandingCta title={['Want a seat', 'at the table?']} sub="Every board member started as a new member." />
    </div>
  )
}
