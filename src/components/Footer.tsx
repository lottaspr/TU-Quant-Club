import { Link } from 'react-router-dom'
import { Logo } from './Logo'
import { CLUB, EMAIL, INSTAGRAM_URL, LINKEDIN_URL, TAGLINE } from '../content'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div>
            <Link to="/" className="brand">
              <Logo />
              {CLUB}
            </Link>
            <p className="muted" style={{ marginTop: 16, maxWidth: '32ch' }}>
              {TAGLINE}. Bringing STEM students closer to financial markets.
            </p>
          </div>
          <div className="footer__col">
            <h4>Navigate</h4>
            <Link to="/about">About</Link>
            <Link to="/team">Team</Link>
            <Link to="/events">Events</Link>
            <Link to="/apply">Apply</Link>
          </div>
          <div className="footer__col">
            <h4>Connect</h4>
            <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">LinkedIn</a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">Instagram</a>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </div>
        </div>
        <svg className="footer__word" viewBox="0 0 1000 150" aria-hidden="true">
          <defs>
            <linearGradient id="fw" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#fff" />
              <stop offset="1" stopColor="#fff" stopOpacity="0.06" />
            </linearGradient>
          </defs>
          <text x="0" y="122" textLength="1000" lengthAdjust="spacingAndGlyphs" fill="url(#fw)">
            {CLUB}
          </text>
        </svg>
        <div className="footer__bottom">
          <span>© {CLUB} {new Date().getFullYear()}</span>
          <span>Munich, Germany</span>
        </div>
      </div>
    </footer>
  )
}
