import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { FiToggleLeft, FiToggleRight } from 'react-icons/fi'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/admin/users').then(r => setUsers(r.data)).finally(() => setLoading(false))
  }, [])

  const toggle = async (id) => {
    try {
      const { data } = await axios.put(`/admin/users/${id}/toggle`)
      setUsers(us => us.map(u => u._id === id ? data : u))
      toast.success(`User ${data.isActive ? 'activated' : 'deactivated'}`)
    } catch { toast.error('Action failed') }
  }

  return (
    <div className="space-y-6">
      <div><p className="eyebrow mb-1">Manage</p><h1 className="font-display text-3xl font-bold">Users</h1></div>
      <div className="card-dark overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-stone-800/60">
            {['User','Email','Role','Phone','Joined','Status','Action'].map(h => <th key={h} className="text-left py-4 px-4 text-xs text-stone-500 tracking-widest uppercase font-medium">{h}</th>)}
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={7} className="py-20 text-center"><div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto" /></td></tr>
            : users.map(u => (
              <tr key={u._id} className="table-row">
                <td className="py-3 px-4"><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-gold-600/20 border border-gold-500/30 flex items-center justify-center text-gold-400 text-xs font-bold shrink-0">{u.name?.[0]?.toUpperCase()}</div><p className="font-medium text-stone-200">{u.name}</p></div></td>
                <td className="py-3 px-4 text-stone-400 text-xs">{u.email}</td>
                <td className="py-3 px-4"><span className={`status-badge border text-xs ${u.role==='admin'?'bg-gold-500/10 text-gold-400 border-gold-500/20':'bg-stone-500/10 text-stone-400 border-stone-500/20'}`}>{u.role}</span></td>
                <td className="py-3 px-4 text-stone-500 text-xs">{u.phone || '—'}</td>
                <td className="py-3 px-4 text-stone-500 text-xs">{new Date(u.createdAt).toLocaleDateString('en-US',{month:'short',year:'numeric'})}</td>
                <td className="py-3 px-4"><span className={`status-badge border text-xs ${u.isActive?'bg-green-500/10 text-green-400 border-green-500/20':'bg-red-500/10 text-red-400 border-red-500/20'}`}>{u.isActive?'Active':'Inactive'}</span></td>
                <td className="py-3 px-4"><button onClick={() => toggle(u._id)} className={`text-xl transition-colors ${u.isActive?'text-green-400 hover:text-red-400':'text-red-400 hover:text-green-400'}`}>{u.isActive?<FiToggleRight/>:<FiToggleLeft/>}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && !users.length && <p className="text-center text-stone-600 py-12 text-sm">No users found</p>}
      </div>
    </div>
  )
}