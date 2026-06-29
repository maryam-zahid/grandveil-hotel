import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { FiTrash2, FiStar } from 'react-icons/fi'

export default function AdminReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => { setLoading(true); axios.get('/reviews').then(r => setReviews(r.data)).finally(() => setLoading(false)) }
  useEffect(load, [])

  const del = async (id) => {
    if (!confirm('Delete this review?')) return
    try { await axios.delete(`/reviews/${id}`); toast.success('Deleted'); load() }
    catch { toast.error('Could not delete') }
  }

  return (
    <div className="space-y-6">
      <div><p className="eyebrow mb-1">Manage</p><h1 className="font-display text-3xl font-bold">Reviews</h1></div>
      <div className="card-dark overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-stone-800/60">
            {['Guest','Room','Rating','Review','Date','Action'].map(h => <th key={h} className="text-left py-4 px-4 text-xs text-stone-500 tracking-widest uppercase font-medium">{h}</th>)}
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={6} className="py-20 text-center"><div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto" /></td></tr>
            : reviews.map(r => (
              <tr key={r._id} className="table-row">
                <td className="py-3 px-4"><p className="font-medium text-stone-200">{r.user?.name}</p><p className="text-xs text-stone-600">{r.user?.email}</p></td>
                <td className="py-3 px-4 text-stone-400 text-xs">{r.room?.name}</td>
                <td className="py-3 px-4"><div className="flex items-center gap-1 text-gold-400">{Array(r.rating).fill(0).map((_,i)=><FiStar key={i} size={11} className="fill-gold-400"/>)}<span className="text-xs ml-1">{r.rating}</span></div></td>
                <td className="py-3 px-4 max-w-xs"><p className="text-xs font-medium text-stone-300 mb-0.5">{r.title}</p><p className="text-xs text-stone-500 line-clamp-2">{r.comment}</p></td>
                <td className="py-3 px-4 text-stone-500 text-xs">{new Date(r.createdAt).toLocaleDateString()}</td>
                <td className="py-3 px-4"><button onClick={() => del(r._id)} className="p-1.5 text-stone-400 hover:text-red-400 hover:bg-red-500/10 transition-all"><FiTrash2 size={13} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && !reviews.length && <p className="text-center text-stone-600 py-12 text-sm">No reviews yet</p>}
      </div>
    </div>
  )
}