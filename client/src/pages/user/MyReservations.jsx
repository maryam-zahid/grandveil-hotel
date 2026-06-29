import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { FiCalendar, FiArrowRight, FiX } from 'react-icons/fi'

const STATUS_COLORS = {
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  confirmed: 'bg-green-500/10 text-green-400 border-green-500/20',
  'checked-in': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'checked-out': 'bg-stone-500/10 text-stone-400 border-stone-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
}

export default function MyReservations() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(null)

  useEffect(() => {
    axios.get('/reservations/my').then(r => setReservations(r.data)).finally(() => setLoading(false))
  }, [])

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this reservation?')) return
    setCancelling(id)
    try {
      const { data } = await axios.put(`/reservations/${id}/cancel`, { reason: 'Cancelled by guest' })
      setReservations(rs => rs.map(r => r._id === id ? data : r))
      toast.success('Reservation cancelled successfully')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not cancel reservation')
    } finally {
      setCancelling(null)
    }
  }

  if (loading) return <div className="min-h-screen pt-28 flex items-center justify-center"><div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <p className="eyebrow mb-3">Guest Portal</p>
          <h1 className="font-display text-4xl font-bold">My Reservations</h1>
          <div className="gold-divider mt-4" />
        </div>

        {reservations.length === 0 ? (
          <div className="card-dark p-16 text-center">
            <FiCalendar size={40} className="text-stone-700 mx-auto mb-4" />
            <p className="font-display text-2xl font-semibold mb-3 text-stone-400">No reservations yet</p>
            <p className="text-stone-600 mb-8 text-sm">Your upcoming and past stays will appear here.</p>
            <Link to="/rooms" className="btn-gold inline-flex text-xs py-3 px-8">Browse Rooms</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map(r => (
              <div key={r._id} className="card-dark p-6 flex flex-col sm:flex-row gap-4">
                <div className="sm:w-32 h-24 sm:h-auto overflow-hidden rounded-sm shrink-0">
                  <img src={r.room?.images?.[0] || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300&q=80&auto=format&fit=crop'}
                    alt={r.room?.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                    <div>
                      <p className="font-display text-lg font-semibold">{r.room?.name}</p>
                      <p className="text-xs text-stone-500">{r.room?.type} · Code: <span className="text-gold-500 font-mono">{r.confirmationCode}</span></p>
                    </div>
                    <span className={`status-badge border ${STATUS_COLORS[r.status]}`}>{r.status}</span>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-stone-400 mb-3">
                    <span>Check In: <span className="text-stone-200">{new Date(r.checkIn).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</span></span>
                    <span>Check Out: <span className="text-stone-200">{new Date(r.checkOut).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</span></span>
                    <span>{r.totalNights} night{r.totalNights>1?'s':''}</span>
                    <span className="text-gold-400 font-semibold">${r.totalAmount}</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link to={`/my-reservations/${r._id}`}
                      className="btn-outline text-xs py-1.5 px-4 flex items-center gap-1.5">
                      Details <FiArrowRight size={11} />
                    </Link>
                    {['pending', 'confirmed'].includes(r.status) && (
                      <button onClick={() => handleCancel(r._id)} disabled={cancelling === r._id}
                        className="flex items-center gap-1.5 px-4 py-1.5 text-xs text-red-400 border border-red-500/20 hover:border-red-500/50 hover:bg-red-500/5 transition-all disabled:opacity-50">
                        {cancelling === r._id ? '...' : <><FiX size={11} /> Cancel</>}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}