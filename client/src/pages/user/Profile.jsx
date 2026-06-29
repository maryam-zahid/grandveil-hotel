import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'
import { FiUser, FiMail, FiPhone, FiLock, FiSave } from 'react-icons/fi'

export default function Profile() {
  const { user, updateProfile } = useAuth()
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', city: user?.address?.city || '', country: user?.address?.country || '' })
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [pwLoading, setPwLoading] = useState(false)
  const set = k => e => setForm(f => ({...f, [k]: e.target.value}))
  const setPw = k => e => setPwForm(f => ({...f, [k]: e.target.value}))

  const handleProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await updateProfile({ name: form.name, phone: form.phone, address: { city: form.city, country: form.country } })
      toast.success('Profile updated successfully')
    } catch { toast.error('Update failed') }
    finally { setLoading(false) }
  }

  const handlePassword = async (e) => {
    e.preventDefault()
    if (pwForm.newPassword !== pwForm.confirm) return toast.error('Passwords do not match')
    if (pwForm.newPassword.length < 6) return toast.error('Password must be at least 6 characters')
    setPwLoading(true)
    try {
      await axios.put('/auth/change-password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword })
      toast.success('Password updated')
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' })
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
    finally { setPwLoading(false) }
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10">
          <p className="eyebrow mb-3">Account Settings</p>
          <h1 className="font-display text-4xl font-bold">My Profile</h1>
          <div className="gold-divider mt-4" />
        </div>

        <div className="flex items-center gap-5 card-dark p-6 mb-6">
          <div className="w-16 h-16 rounded-full bg-gold-600/20 border-2 border-gold-500/40 flex items-center justify-center text-gold-400 text-2xl font-display font-bold">{user?.name?.[0]?.toUpperCase()}</div>
          <div>
            <p className="font-display text-xl font-semibold">{user?.name}</p>
            <p className="text-stone-500 text-sm">{user?.email}</p>
            <p className="text-xs text-gold-500 mt-1 tracking-wide capitalize">{user?.role} · {user?.loyaltyPoints || 0} Loyalty Points</p>
          </div>
        </div>

        <form onSubmit={handleProfile} className="card-dark p-6 mb-6">
          <h2 className="font-display text-xl font-semibold mb-5">Personal Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-gold">Full Name</label>
              <div className="relative"><FiUser size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
              <input className="input-dark pl-9" value={form.name} onChange={set('name')} /></div>
            </div>
            <div>
              <label className="label-gold">Email</label>
              <div className="relative"><FiMail size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
              <input className="input-dark pl-9 opacity-60" value={user?.email} disabled /></div>
            </div>
            <div>
              <label className="label-gold">Phone</label>
              <div className="relative"><FiPhone size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
              <input className="input-dark pl-9" value={form.phone} onChange={set('phone')} placeholder="+1 (000) 000-0000" /></div>
            </div>
            <div>
              <label className="label-gold">City</label>
              <input className="input-dark" value={form.city} onChange={set('city')} placeholder="Your city" />
            </div>
            <div>
              <label className="label-gold">Country</label>
              <input className="input-dark" value={form.country} onChange={set('country')} placeholder="Your country" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-gold mt-5 text-xs py-3 px-8 flex items-center gap-2">
            <FiSave size={13} /> {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        <form onSubmit={handlePassword} className="card-dark p-6">
          <h2 className="font-display text-xl font-semibold mb-5">Change Password</h2>
          <div className="space-y-4">
            {[['currentPassword','Current Password','Your current password'],['newPassword','New Password','Min. 6 characters'],['confirm','Confirm New Password','Repeat new password']].map(([k,l,p]) => (
              <div key={k}>
                <label className="label-gold">{l}</label>
                <div className="relative"><FiLock size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                <input type="password" className="input-dark pl-9" placeholder={p} value={pwForm[k]} onChange={setPw(k)} /></div>
              </div>
            ))}
          </div>
          <button type="submit" disabled={pwLoading} className="btn-gold mt-5 text-xs py-3 px-8">
            {pwLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  )
}