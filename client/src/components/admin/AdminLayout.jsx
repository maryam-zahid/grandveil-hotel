import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { FiGrid, FiHome, FiUsers, FiCalendar, FiStar, FiLogOut, FiMenu, FiX } from 'react-icons/fi'
import { MdHotel } from 'react-icons/md'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: FiGrid, end: true },
  { to: '/admin/rooms', label: 'Rooms', icon: MdHotel },
  { to: '/admin/reservations', label: 'Reservations', icon: FiCalendar },
  { to: '/admin/users', label: 'Users', icon: FiUsers },
  { to: '/admin/reviews', label: 'Reviews', icon: FiStar },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sideOpen, setSideOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }

  const Sidebar = () => (
    <aside className="w-64 min-h-screen bg-stone-950 border-r border-stone-800/60 flex flex-col">
      <div className="p-6 border-b border-stone-800/60">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-7 h-7 border border-gold-500/60 flex items-center justify-center"><MdHotel className="text-gold-500 text-xs" /></div>
          <span className="font-display text-lg font-semibold tracking-widest">GRAND<span className="text-gold-500">VEIL</span></span>
        </div>
        <p className="text-xs text-stone-600 ml-10">Admin Panel</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Icon size={15} /> {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-stone-800/60">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-7 h-7 rounded-full bg-gold-600/20 border border-gold-500/30 flex items-center justify-center text-gold-400 text-xs font-bold">{user?.name?.[0]}</div>
          <div className="overflow-hidden">
            <p className="text-xs font-medium text-stone-300 truncate">{user?.name}</p>
            <p className="text-xs text-stone-600">Administrator</p>
          </div>
        </div>
        <NavLink to="/" className="sidebar-link text-xs"><FiHome size={13} /> View Site</NavLink>
        <button onClick={handleLogout} className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/5 text-xs"><FiLogOut size={13} /> Sign Out</button>
      </div>
    </aside>
  )

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex"><Sidebar /></div>

      {/* Mobile sidebar */}
      {sideOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="flex"><Sidebar /></div>
          <div className="flex-1 bg-black/50" onClick={() => setSideOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 bg-stone-950/95 backdrop-blur-sm border-b border-stone-800/60 px-6 py-4 flex items-center justify-between">
          <button onClick={() => setSideOpen(v => !v)} className="lg:hidden text-stone-400 hover:text-gold-400">
            {sideOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
          <div className="text-xs text-stone-500 hidden sm:block">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gold-600/20 border border-gold-500/30 flex items-center justify-center text-gold-400 text-xs font-bold">{user?.name?.[0]}</div>
            <span className="text-xs text-stone-400 hidden sm:inline">{user?.name}</span>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}