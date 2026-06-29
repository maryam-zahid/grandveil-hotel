import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { MdHotel } from 'react-icons/md'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) return toast.error('Please fill in all fields')
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`)
      navigate(user.role === 'admin' ? '/admin' : from, { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=90&auto=format&fit=crop"
          alt="Hotel" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 to-stone-950/40" />
        <div className="absolute bottom-16 left-12 right-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 border border-gold-500/60 flex items-center justify-center">
              <MdHotel className="text-gold-500 text-sm" />
            </div>
            <span className="font-display text-xl font-semibold tracking-[0.15em]">GRAND<span className="text-gold-500">VEIL</span></span>
          </div>
          <p className="font-display text-3xl font-semibold text-stone-100 leading-tight mb-3">
            "Where every stay<br />becomes a memory."
          </p>
          <p className="text-stone-400 text-sm">Experience the art of hospitality redefined.</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 justify-center mb-10">
            <MdHotel className="text-gold-500 text-xl" />
            <span className="font-display text-xl font-semibold tracking-widest">GRAND<span className="text-gold-500">VEIL</span></span>
          </div>

          <div className="mb-10">
            <p className="eyebrow mb-3">Welcome Back</p>
            <h1 className="font-display text-4xl font-bold mb-2">Sign In</h1>
            <div className="gold-divider" />
          </div>

          {/* Demo credentials */}
          <div className="card-dark p-4 mb-6 border-gold-500/20">
            <p className="text-xs text-gold-500 font-medium mb-2 tracking-wide">DEMO CREDENTIALS</p>
            <p className="text-xs text-stone-400">Admin: <span className="text-stone-300">admin@grandveil.com / admin123</span></p>
            <p className="text-xs text-stone-400 mt-1">Guest: <span className="text-stone-300">guest@grandveil.com / guest123</span></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label-gold">Email Address</label>
              <div className="relative">
                <FiMail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                <input type="email" placeholder="you@example.com" className="input-dark pl-9"
                  value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
              </div>
            </div>
            <div>
              <label className="label-gold">Password</label>
              <div className="relative">
                <FiLock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                <input type={showPw ? 'text' : 'password'} placeholder="Your password" className="input-dark pl-9 pr-9"
                  value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300">
                  {showPw ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-gold w-full py-4 text-sm mt-2">
              {loading ? <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin mx-auto" /> : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-stone-500 mt-6">
            New to GrandVeil?{' '}
            <Link to="/register" className="text-gold-400 hover:text-gold-300 transition-colors">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}