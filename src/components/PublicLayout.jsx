import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

export default function PublicLayout({ children, overlayNav = false }) {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/clients', label: 'Clients' },
    { path: '/careers', label: 'Careers' },
    { path: '/contact', label: 'Contact' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <nav
        className={
          overlayNav
            ? 'fixed top-0 left-0 right-0 z-50 bg-black/25 backdrop-blur-md border-b border-white/10'
            : 'bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm'
        }
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Class 17 Events logo"
                className="h-10 w-auto object-contain"
              />
              <span className={overlayNav ? 'text-2xl font-bold text-white' : 'text-2xl font-bold text-gradient'}>
                Class 17 Events
              </span>
            </Link>
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    location.pathname === link.path
                      ? overlayNav
                        ? 'bg-white/15 text-white shadow-md'
                        : 'bg-gradient-to-r from-emerald-700 via-green-700 to-teal-700 text-white shadow-md'
                      : overlayNav
                        ? 'text-white/90 hover:text-white hover:bg-white/10'
                        : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={overlayNav ? 'md:hidden p-2 text-white/90 hover:text-white' : 'md:hidden p-2 text-gray-700 hover:text-emerald-700'}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg font-medium ${
                    location.pathname === link.path
                      ? overlayNav
                        ? 'bg-white/15 text-white'
                        : 'bg-gradient-to-r from-emerald-700 via-green-700 to-teal-700 text-white'
                      : overlayNav
                        ? 'text-white/90 hover:bg-white/10'
                        : 'text-gray-700 hover:bg-emerald-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>
      <main className="min-h-screen">{children}</main>
      <footer className="bg-gradient-to-r from-[#071a12] via-[#0b2419] to-[#071a12] text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-emerald-300 via-green-300 to-teal-300 bg-clip-text text-transparent">
                Class 17 Events
              </h3>
              <p className="text-gray-400 text-sm">Ideas That Speak Louder Than Words</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                {navLinks.slice(0, 4).map((link) => (
                  <Link key={link.path} to={link.path} className="block text-gray-400 hover:text-white transition text-sm">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <Link to="/contact" className="block text-gray-400 hover:text-white transition text-sm mb-2">
                Get in Touch
              </Link>
              <a
                href="mailto:contact@class17.in"
                className="block text-gray-400 hover:text-white transition text-sm mb-2"
              >
                contact@class17.in
              </a>
              <Link to="/careers" className="block text-gray-400 hover:text-white transition text-sm">
                Join Our Team
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400 text-sm">© 2024 Class 17 Events. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

