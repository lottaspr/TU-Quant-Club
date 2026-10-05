import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Logo } from './Logo'
import { CLUB } from '../content'
import { useFrame } from '../hooks/scroll'

const LINKS = [
  { to: '/about', label: 'About' },
  { to: '/team', label: 'Team' },
  { to: '/events', label: 'Events' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const lastY = useRef(0)
  const barRef = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()

  useFrame(() => {
    const y = window.scrollY
    const max = document.documentElement.scrollHeight - window.innerHeight
    barRef.current?.style.setProperty('--progress', String(max > 0 ? y / max : 0))
    setScrolled(y > 24)
    setHidden(y > 240 && y > lastY.current + 4 ? true : y < lastY.current - 4 ? false : hidden)
    lastY.current = y
  })

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <>
      <div className="progress" ref={barRef} />
      <header className={`nav ${scrolled ? 'is-scrolled' : ''} ${hidden && !open ? 'is-hidden' : ''}`}>
        <div className="container nav__inner">
          <Link to="/" className="brand" aria-label={`${CLUB} home`}>
            <Logo />
            {CLUB}
          </Link>
          <nav className="nav__links" aria-label="Main">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} className="nav__link">
                {l.label}
              </NavLink>
            ))}
            <Link to="/apply" className="btn btn--primary btn--small">
              Apply now <span className="arrow">→</span>
            </Link>
          </nav>
          <button
            className={`nav__toggle ${open ? 'open' : ''}`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>
      <div className={`menu ${open ? 'open' : ''}`} aria-hidden={!open}>
        {[{ to: '/', label: 'Home' }, ...LINKS, { to: '/apply', label: 'Apply' }].map((l) => (
          <Link key={l.to} to={l.to} tabIndex={open ? 0 : -1}>
            {l.label}
          </Link>
        ))}
      </div>
    </>
  )
}
