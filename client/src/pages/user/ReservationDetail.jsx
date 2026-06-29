import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { FiArrowLeft, FiCheck } from 'react-icons/fi'

const STATUS_COLORS = {
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  confirmed: 'bg-green-500/10 text-green-400 border-green-500/20',
  'checked-in': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'checked-out': 'bg-stone-500/10 text-stone-400 border-stone-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
}

export default function ReservationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [res, setRes] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`/reservations/${id}`)
      .then(r => setRes(r.data))
      .catch(() => navigate('/my-reservations'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="min-h-screen pt-28 flex items-center justify-center"><div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" /></div>
  if (!res) return null

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate('/my-reservations')} className="flex items-center gap-2 text-stone-400 hover:text-gold-400 transition-colors text-sm mb-8">
          <FiArrowLeft size={14} /> Back to Reservations
        </button>
        <div className="mb-8">
          <p className="eyebrow mb-3">Reservation Details</p>
          <div className="flex items-center gap-4">
            <h1 className="font-display text-4xl font-bold">Booking #{res.confirmationCode}</h1>
            <span className={`status-badge border ${STATUS_COLORS[res.status]}`}>{res.status}</span>
          </div>
          <div className="gold-divider mt-4" />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card-dark p-6">
            <h2 className="font-display text-xl font-semibold mb-4">Room</h2>
            <div className="h-40 overflow-hidden rounded-sm mb-4">
              <img src={res.room?.images?.[0] || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80'} alt="" className="w-full h-full object-cover" />
            </div>
            <p className="font-semibold text-lg">{res.room?.name}</p>
            <p className="text-stone-500 text-sm">{res.room?.type} · Room {res.room?.roomNumber}</p>
          </div>
          <div className="card-dark p-6">
            <h2 className="font-display text-xl font-semibold mb-4">Stay Info</h2>
            <div className="space-y-3 text-sm">
              {[
                ['Check In', new Date(res.checkIn).toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'})],
                ['Check Out', new Date(res.checkOut).toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'})],
                ['Duration', `${res.totalNights} night${res.totalNights > 1 ? 's' : ''}`],
                ['Guests', `${res.guests?.adults} adult${res.guests?.adults > 1 ? 's' : ''}${res.guests?.children ? `, ${res.guests.children} children` : ''}`],
                ['Payment', res.paymentStatus],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-stone-800/50 pb-2">
                  <span className="text-stone-500">{k}</span>
                  <span className="text-stone-200 capitalize">{v}</span>
                </div>
              ))}
              <div className="flex justify-between pt-1 font-semibold text-base">
                <span className="text-stone-400">Total Amount</span>
                <span className="text-gold-400">${res.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
        {res.specialRequests && (
          <div className="card-dark p-6 mt-6">
            <h2 className="font-display text-xl font-semibold mb-2">Special Requests</h2>
            <p className="text-stone-400 text-sm">{res.specialRequests}</p>
          </div>
        )}
        <div className="card-dark p-6 mt-6">
          <h2 className="font-display text-xl font-semibold mb-4">Included With Your Stay</h2>
          {['Free cancellation (48h before check-in)', 'Complimentary breakfast for 2', '24/7 concierge service', 'Complimentary valet parking', 'Access to spa & infinity pool'].map(f => (
            <div key={f} className="flex items-center gap-2 text-sm text-stone-400 mb-2">
              <FiCheck size={12} className="text-gold-500 shrink-0" /> {f}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}