import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { History, Menu, ScanLine, X } from 'lucide-react'
import { Button } from '../ui/Button'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/analyze', label: 'Medicine Interaction' },
  { to: '/blogs', label: 'Blogs' },
  { to: '/about', label: 'About' },
  { to: '/history', label: 'History' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Prevent background scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-ring ${
      isActive ? 'bg-sky-50 text-sky-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-white/85 backdrop-blur-md transition-shadow ${
        scrolled ? 'border-slate-200 shadow-sm shadow-slate-900/[0.04]' : 'border-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="focus-ring flex items-center gap-2.5 rounded-xl" aria-label="MediScan AI home">
          <span className="flex size-9 items-center justify-center rounded-xl bg-sky-600 text-white shadow-sm shadow-sky-600/30">
            <ScanLine className="size-5" aria-hidden />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-slate-900">
            MediScan<span className="text-sky-600">AI</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/analyze" className="focus-ring rounded-xl">
            <Button size="sm">
              <ScanLine className="size-4" aria-hidden />
              Scan Medicine
            </Button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="focus-ring rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 top-16 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-slate-900/30"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <nav
            className="animate-fade-up absolute inset-x-0 top-0 border-b border-slate-200 bg-white p-4 shadow-lg"
            aria-label="Mobile navigation"
          >
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      `flex items-center rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                        isActive ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-100'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t border-slate-100 pt-4">
              <Link to="/analyze" className="focus-ring block rounded-xl">
                <Button className="w-full" size="lg">
                  <ScanLine className="size-5" aria-hidden />
                  Scan Medicine
                </Button>
              </Link>
            </div>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-400">
              <History className="size-3.5" aria-hidden />
              History is stored on this device only
            </p>
          </nav>
        </div>
      )}
    </header>
  )
}
