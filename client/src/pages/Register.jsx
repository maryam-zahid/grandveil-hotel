import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi'
import { MdHotel } from 'react-icons/md'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const set = k => e => setForm(f => ({...f, [k]: e.target.value}))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) return toast.error('Please fill in all required fields')
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      await register(form.name, form.email, form.password, form.phone)
      toast.success('Welcome to GrandVeil!')
      navigate('/', { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&q=90&auto=format&fit=crop"
          alt="Hotel" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 to-stone-950/40" />
        <div className="absolute bottom-16 left-12 right-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 border border-gold-500/60 flex items-center justify-center">
              <MdHotel className="text-gold-500 text-sm" />
            </div>
            <span className="font-display text-xl font-semibold tracking-widest">GRAND<span className="text-gold-500">VEIL</span></span>
          </div>
          <p className="font-display text-3xl font-semibold text-stone-100 leading-tight mb-3">
            Join a world of<br />refined luxury.
          </p>
          <p className="text-stone-400 text-sm">Members enjoy exclusive rates, early access and personalized service.</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 justify-center mb-10">
            <MdHotel className="text-gold-500 text-xl" />
            <span className="font-display text-xl font-semibold tracking-widest">GRAND<span className="text-gold-500">VEIL</span></span>
          </div>

          <div className="mb-10">
            <p className="eyebrow mb-3">Create Account</p>
            <h1 className="font-display text-4xl font-bold mb-2">Register</h1>
            <div className="gold-divider" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-gold">Full Name *</label>
              <div className="relative">
                <FiUser size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                <input type="text" placeholder="Your full name" className="input-dark pl-9"
                  value={form.name} onChange={set('name')} />
              </div>
            </div>
            <div>
              <label className="label-gold">Email Address *</label>
              <div className="relative">
                <FiMail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                <input type="email" placeholder="you@example.com" className="input-dark pl-9"
                  value={form.email} onChange={set('email')} />
              </div>
            </div>
            <div>
              <label className="label-gold">Phone Number</label>
              <div className="relative">
                <FiPhone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                <input type="tel" placeholder="+1 (000) 000-0000" className="input-dark pl-9"
                  value={form.phone} onChange={set('phone')} />
              </div>
            </div>
            <div>
              <label className="label-gold">Password *</label>
              <div className="relative">
                <FiLock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                <input type={showPw ? 'text' : 'password'} placeholder="Min. 6 characters" className="input-dark pl-9 pr-9"
                  value={form.password} onChange={set('password')} />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300">
                  {showPw ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
            </div>
            <p className="text-xs text-stone-600">By registering, you agree to our Terms of Service and Privacy Policy.</p>
            <button type="submit" disabled={loading} className="btn-gold w-full py-4 text-sm">
              {loading ? <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin mx-auto" /> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-stone-500 mt-6">
            Already a member?{' '}
            <Link to="/login" className="text-gold-400 hover:text-gold-300 transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}