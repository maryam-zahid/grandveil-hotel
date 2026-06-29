import { useState, useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { FiMenu, FiX, FiUser, FiLogOut, FiCalendar, FiSettings } from 'react-icons/fi'
import { MdHotel } from 'react-icons/md'

export default function Layout() {
  const { user, logout, isAdmin } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false); setUserMenuOpen(false) }, [location])

  return (
    <div className="min-h-screen flex flex-col">
      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || !isHome
          ? 'bg-stone-950/95 backdrop-blur-md border-b border-stone-800/60 py-3'
          : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 border border-gold-500/60 flex items-center justify-center group-hover:border-gold-400 transition-colors">
              <MdHotel className="text-gold-500 text-sm group-hover:text-gold-400 transition-colors" />
            </div>
            <span className="font-display text-xl font-semibold tracking-[0.15em] text-stone-100">
              GRAND<span className="text-gold-500">VEIL</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {[['/', 'Home'], ['/rooms', 'Rooms'], ['/#amenities', 'Amenities'], ['/#contact', 'Contact']].map(([to, label]) => (
              <Link key={to} to={to} className="text-xs tracking-widest uppercase text-stone-400 hover:text-gold-400 transition-colors duration-200 relative group">
                {label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold-500 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* User actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button onClick={() => setUserMenuOpen(v => !v)}
                  className="flex items-center gap-2 px-3 py-2 rounded-sm text-sm text-stone-300 hover:text-gold-400 hover:bg-stone-800/50 transition-all duration-200 border border-stone-700/40 hover:border-gold-500/30">
                  <div className="w-6 h-6 rounded-full bg-gold-600/20 border border-gold-500/40 flex items-center justify-center text-gold-400 text-xs font-semibold">
                    {user.name[0].toUpperCase()}
                  </div>
                  <span className="text-xs tracking-wide">{user.name.split(' ')[0]}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 card-dark py-1 shadow-2xl shadow-black/50 animate-fade-in">
                    <div className="px-4 py-3 border-b border-stone-700/50">
                      <p className="text-sm font-medium text-stone-200">{user.name}</p>
                      <p className="text-xs text-stone-500 mt-0.5">{user.email}</p>
                    </div>
                    {isAdmin && <Link to="/admin" className="flex items-center gap-2 px-4 py-2.5 text-xs text-gold-400 hover:bg-stone-800/50 transition-colors"><FiSettings size={13} /> Admin Panel</Link>}
                    <Link to="/my-reservations" className="flex items-center gap-2 px-4 py-2.5 text-xs text-stone-300 hover:text-stone-100 hover:bg-stone-800/50 transition-colors"><FiCalendar size={13} /> My Reservations</Link>
                    <Link to="/profile" className="flex items-center gap-2 px-4 py-2.5 text-xs text-stone-300 hover:text-stone-100 hover:bg-stone-800/50 transition-colors"><FiUser size={13} /> Profile</Link>
                    <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors border-t border-stone-700/50 mt-1"><FiLogOut size={13} /> Sign out</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-outline text-xs py-2.5 px-5">Sign In</Link>
                <Link to="/register" className="btn-gold text-xs py-2.5 px-5">Reserve Now</Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMenuOpen(v => !v)} className="md:hidden text-stone-300 hover:text-gold-400 p-1">
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-stone-950/98 border-t border-stone-800/60 px-6 py-4 animate-fade-in">
            <div className="flex flex-col gap-1">
              {[['/', 'Home'], ['/rooms', 'Rooms'], ['/#amenities', 'Amenities'], ['/#contact', 'Contact']].map(([to, label]) => (
                <Link key={to} to={to} className="py-2.5 text-sm text-stone-400 hover:text-gold-400 border-b border-stone-800/40 transition-colors">{label}</Link>
              ))}
              {user ? (
                <>
                  <Link to="/my-reservations" className="py-2.5 text-sm text-stone-400 hover:text-gold-400 border-b border-stone-800/40">My Reservations</Link>
                  <Link to="/profile" className="py-2.5 text-sm text-stone-400 hover:text-gold-400 border-b border-stone-800/40">Profile</Link>
                  {isAdmin && <Link to="/admin" className="py-2.5 text-sm text-gold-500 border-b border-stone-800/40">Admin Panel</Link>}
                  <button onClick={logout} className="py-2.5 text-sm text-red-400 text-left">Sign Out</button>
                </>
              ) : (
                <div className="flex gap-3 mt-3">
                  <Link to="/login" className="btn-outline flex-1 text-xs py-2.5">Sign In</Link>
                  <Link to="/register" className="btn-gold flex-1 text-xs py-2.5">Register</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="bg-stone-950 border-t border-stone-800/60 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 border border-gold-500/60 flex items-center justify-center">
                  <MdHotel className="text-gold-500 text-sm" />
                </div>
                <span className="font-display text-xl font-semibold tracking-[0.15em]">GRAND<span className="text-gold-500">VEIL</span></span>
              </div>
              <p className="text-sm text-stone-500 leading-relaxed max-w-xs">Where luxury meets legacy. Experience the pinnacle of hospitality in a setting that redefines excellence.</p>
              <div className="flex gap-4 mt-6">
                {['instagram', 'facebook', 'twitter'].map(s => (
                  <a key={s} href="#" className="w-8 h-8 border border-stone-700/50 flex items-center justify-center text-stone-500 hover:border-gold-500/50 hover:text-gold-400 transition-all duration-200 text-xs uppercase">{s[0]}</a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="eyebrow mb-5">Navigate</h4>
              {[['/', 'Home'], ['/rooms', 'Our Rooms'], ['/login', 'Sign In'], ['/register', 'Register']].map(([to, label]) => (
                <Link key={to} to={to} className="block text-sm text-stone-500 hover:text-gold-400 mb-2.5 transition-colors">{label}</Link>
              ))}
            </div>
            <div>
              <h4 className="eyebrow mb-5">Contact</h4>
              <p className="text-sm text-stone-500 mb-2">1 Grand Veil Boulevard</p>
              <p className="text-sm text-stone-500 mb-2">Monte Carlo, Monaco</p>
              <p className="text-sm text-stone-500 mb-2">+1 (800) 000-VEIL</p>
              <p className="text-sm text-gold-500/80">reservations@grandveil.com</p>
            </div>
          </div>
          <div className="border-t border-stone-800/60 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-xs text-stone-600">© 2026 GrandVeil Hotel. All rights reserved.</p>
            <div className="flex gap-5">
              {['Privacy Policy', 'Terms', 'Cookie Policy'].map(t => (
                <a key={t} href="#" className="text-xs text-stone-600 hover:text-stone-400 transition-colors">{t}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}