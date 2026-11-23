import { Link, NavLink, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { CONTACT_EMAIL, Icon, whatsappLink } from './ui'

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/services', label: 'Services' },
  { path: '/portfolio', label: 'Work' },
  { path: '/clients', label: 'Clients' },
  { path: '/careers', label: 'Careers' },
]

function Brand({ light = false }) {
  return (
    <Link to="/" className="flex items-center gap-3">
      <img src="/logo.svg" alt="Class 17 logo" className="h-12 w-12 shrink-0 rounded-full object-cover" />
      <span className="leading-none">
        <span
          className={`block font-display text-xl font-semibold tracking-wide transition-colors ${
            light ? 'text-white' : 'text-ink-950'
          }`}
        >
          Class 17
        </span>
        <span
          className={`mt-1 block text-[10px] font-medium uppercase tracking-[0.35em] ${
            light ? 'text-gold-400' : 'text-gold-600'
          }`}
        >
          Events
        </span>
      </span>
    </Link>
  )
}

export default function PublicLayout({ children }) {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    window.scrollTo(0, 0)
  }, [location.pathname])

  const solid = scrolled || menuOpen
  const overPhoto = location.pathname === '/' && !solid

  return (
    <div className="min-h-screen overflow-x-clip bg-white text-zinc-600">
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          solid ? 'border-b border-zinc-200 bg-white/90 shadow-[0_8px_30px_-20px_rgba(16,16,20,0.3)] backdrop-blur-xl' : 'bg-transparent'
        }`}
      >
        <div className="container-x flex h-16 items-center justify-between sm:h-[4.25rem]">
          <Brand light={overPhoto} />

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `relative px-2.5 py-2 text-[13px] font-medium transition-colors xl:px-4 ${
                    isActive
                      ? overPhoto
                        ? 'text-gold-300'
                        : 'text-gold-700'
                      : overPhoto
                        ? 'text-white/85 hover:text-white'
                        : 'text-zinc-700 hover:text-ink-950'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    <span
                      className={`absolute inset-x-4 -bottom-0.5 h-px bg-gold-400 transition-transform duration-300 ${
                        isActive ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/contact" className="btn-gold hidden px-5 py-2.5 sm:inline-flex">
              Let&apos;s talk
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              className={`flex h-11 w-11 items-center justify-center rounded-full border lg:hidden ${
                overPhoto ? 'border-white/25 text-white' : 'border-zinc-300 text-ink-950'
              }`}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" d="M4 8h16M4 16h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-zinc-200 bg-white lg:hidden">
            <nav className="container-x flex flex-col py-4">
              {[...navLinks, { path: '/contact', label: 'Contact' }].map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) =>
                    `border-b border-zinc-100 py-4 font-display text-2xl ${
                      isActive ? 'text-gold-700' : 'text-ink-950'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <Link to="/contact" className="btn-gold mt-6">
                Let&apos;s talk
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main>{children}</main>

      <footer className="on-dark relative bg-ink-950 text-zinc-300">
        <div className="gold-hairline absolute inset-x-0 top-0 h-px" />
        <div className="container-x grid grid-cols-1 gap-12 py-16 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Brand light />
            <p className="mt-6 max-w-sm font-display text-2xl italic leading-snug text-zinc-200">
              Ideas that speak louder than words.
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-500">
              A pan-India marketing and advertising company delivering brand activations, school programs, sports
              engagement and on-ground events.
            </p>
          </div>

          <div className="lg:col-span-2">
            <h4 className="mb-5 font-sans text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">Explore</h4>
            <ul className="space-y-3 text-sm">
              {navLinks.slice(1).map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-zinc-300 transition hover:text-gold-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="mb-5 font-sans text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">Company</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/founder" className="text-zinc-300 transition hover:text-gold-300">Founder</Link>
              </li>
              <li>
                <Link to="/careers" className="text-zinc-300 transition hover:text-gold-300">Internships</Link>
              </li>
              <li>
                <Link to="/contact" className="text-zinc-300 transition hover:text-gold-300">Contact</Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="mb-5 font-sans text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">Get in touch</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-3 text-zinc-300 transition hover:text-gold-300">
                  <Icon name="mail" className="h-4 w-4 text-gold-400" />
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-zinc-300 transition hover:text-gold-300"
                >
                  <Icon name="phone" className="h-4 w-4 text-gold-400" />
                  +91 91495 59393 (WhatsApp)
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.06]">
          <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs text-zinc-500 sm:flex-row">
            <p>© {new Date().getFullYear()} Class 17. All rights reserved.</p>
            <p className="tracking-[0.2em] uppercase">Marketing &amp; Advertising</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
