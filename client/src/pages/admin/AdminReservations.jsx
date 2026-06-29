import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const STATUS_COLORS = { pending:'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', confirmed:'bg-green-500/10 text-green-400 border-green-500/20', 'checked-in':'bg-blue-500/10 text-blue-400 border-blue-500/20', 'checked-out':'bg-stone-500/10 text-stone-400 border-stone-500/20', cancelled:'bg-red-500/10 text-red-400 border-red-500/20' }
const ALL_STATUSES = ['pending','confirmed','checked-in','checked-out','cancelled']
//making changes 
////////////////////////////////////////////////////
export default function AdminReservations() {
  const [data, setData] = useState({ reservations:[], total:0, pages:1 })
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [page, setPage] = useState(1)

  const load = () => {
    setLoading(true)
    const params = { page, limit: 15 }
    if (filter) params.status = filter
    axios.get('/reservations', { params }).then(r => setData(r.data)).finally(() => setLoading(false))
  }
  useEffect(load, [filter, page])

  const updateStatus = async (id, status) => {
    try { await axios.put(`/reservations/${id}/status`, { status }); toast.success('Status updated'); load() }
    catch { toast.error('Update failed') }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><p className="eyebrow mb-1">Manage</p><h1 className="font-display text-3xl font-bold">Reservations</h1></div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => { setFilter(''); setPage(1) }} className={`px-4 py-1.5 text-xs tracking-widest uppercase border rounded-sm transition-all ${!filter ? 'bg-gold-600 text-stone-950 border-gold-600' : 'border-stone-700 text-stone-400 hover:border-gold-500/40'}`}>All</button>
          {ALL_STATUSES.map(s => <button key={s} onClick={() => { setFilter(s); setPage(1) }} className={`px-4 py-1.5 text-xs tracking-widest uppercase border rounded-sm transition-all capitalize ${filter===s ? 'bg-gold-600 text-stone-950 border-gold-600' : 'border-stone-700 text-stone-400 hover:border-gold-500/40'}`}>{s}</button>)}
        </div>
      </div>
      <div className="card-dark overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-stone-800/60">
            {['Code','Guest','Room','Dates','Nights','Total','Status','Action'].map(h => <th key={h} className="text-left py-4 px-4 text-xs text-stone-500 tracking-widest uppercase font-medium">{h}</th>)}
          </tr></thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="py-20 text-center"><div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto" /></td></tr>
            ) : data.reservations.map(r => (
              <tr key={r._id} className="table-row">
                <td className="py-3 px-4 font-mono text-xs text-gold-500">{r.confirmationCode}</td>
                <td className="py-3 px-4"><p className="font-medium text-stone-200">{r.user?.name}</p><p className="text-xs text-stone-600">{r.user?.email}</p></td>
                <td className="py-3 px-4 text-stone-400 text-xs">{r.room?.name}</td>
                <td className="py-3 px-4 text-stone-400 text-xs">
                  <p>{new Date(r.checkIn).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</p>
                  <p>{new Date(r.checkOut).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</p>
                </td>
                <td className="py-3 px-4 text-stone-400">{r.totalNights}</td>
                <td className="py-3 px-4 text-gold-400 font-semibold">${r.totalAmount}</td>
                <td className="py-3 px-4"><span className={`status-badge border text-xs ${STATUS_COLORS[r.status]}`}>{r.status}</span></td>
              <td className="py-3 px-4">
  <select
    value={r.status}
    onChange={e => updateStatus(r._id, e.target.value)}
    className="bg-stone-800 border border-stone-700 text-xs text-stone-300 rounded-sm px-2 py-1 focus:outline-none focus:border-gold-500"
  >
    {ALL_STATUSES.map(s => (
      <option key={s} value={s}>
        {s}
      </option>
    ))}
  </select>
</td>
             
            
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && !data.reservations.length && <p className="text-center text-stone-600 py-12 text-sm">No reservations found</p>}
      </div>
      {data.pages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({length: data.pages}, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 text-xs border rounded-sm transition-all ${page===p ? 'bg-gold-600 text-stone-950 border-gold-600' : 'border-stone-700 text-stone-400 hover:border-gold-500'}`}>{p}</button>
          ))}
        </div>
      )}
    </div>
  )
}