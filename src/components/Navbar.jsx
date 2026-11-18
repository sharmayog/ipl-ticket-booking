import { useState } from 'react'

const LINKS = [
  { href: '#matches', label: 'Matches' },
  { href: '#book', label: 'Book Ticket' },
  { href: '#bookings', label: 'My Bookings' },
  { href: '#guidelines', label: 'Guidelines' },
]

export default function Navbar({ bookingCount }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="navbar">
      <nav className="nav-inner" aria-label="Main navigation">
        <a href="#top" className="logo">
          <span className="logo-mark">🏏</span> IPL<span className="gold">2026</span>
        </a>

        <button
          className="hamburger"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span /><span /><span />
        </button>

        <ul className={`nav-links ${open ? 'open' : ''}`}>
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)}>
                {l.label}
                {l.href === '#bookings' && bookingCount > 0 && (
                  <span className="badge">{bookingCount}</span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
