import { Link } from 'react-router-dom'
import { Logo } from './Logo'
import { CLUB, EMAIL, INSTAGRAM_URL, LINKEDIN_URL, TAGLINE } from '../content'
import wordmark from '../assets/wordmark-gradient.svg?raw'

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
          <div className="footer__col">
            <h4>Legal</h4>
            <Link to="/imprint">Imprint</Link>
            <Link to="/privacy">Data Privacy</Link>
            <Link to="/disclaimer">Disclaimer</Link>
          </div>
        </div>
        <div className="footer__word" role="img" aria-label={CLUB} dangerouslySetInnerHTML={{ __html: wordmark }} />
        <div className="footer__bottom">
          <span>© {CLUB} {new Date().getFullYear()}</span>
          <span>Munich, Germany</span>
        </div>
      </div>
    </footer>
  )
}
