import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { FiCheck, FiArrowLeft } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

export default function BookingPage() {
  const { roomId } = useParams()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)
  const [form, setForm] = useState({
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    adults: 2, children: 0,
    specialRequests: '',
    paymentMethod: 'card',
    cardNumber: '', cardExpiry: '', cardCvc: '',
  })
  const set = k => e => setForm(f => ({...f, [k]: e.target.value}))

  const nights = form.checkIn && form.checkOut
    ? Math.max(0, Math.ceil((new Date(form.checkOut) - new Date(form.checkIn)) / 86400000))
    : 0

  useEffect(() => {
    axios.get(`/rooms/${roomId}`).then(r => setRoom(r.data)).catch(() => navigate('/rooms'))
  }, [roomId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.checkIn || !form.checkOut) return toast.error('Please select check-in and check-out dates')
    if (nights < 1) return toast.error('Minimum stay is 1 night')
    setLoading(true)
    try {
      const { data } = await axios.post('/reservations', {
        roomId, checkIn: form.checkIn, checkOut: form.checkOut,
        guests: { adults: form.adults, children: form.children },
        specialRequests: form.specialRequests,
        paymentMethod: form.paymentMethod,
      })
      setSuccess(data)
      toast.success('Reservation confirmed!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed')
    } finally {
      setLoading(false)
    }
  }

  if (success) return (
    <div className="min-h-screen pt-28 pb-20 px-4 flex items-center justify-center">
      <div className="max-w-lg w-full card-dark p-10 text-center">
        <div className="w-16 h-16 bg-gold-500/10 border border-gold-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiCheck size={28} className="text-gold-400" />
        </div>
        <p className="eyebrow mb-3">Booking Confirmed</p>
        <h1 className="font-display text-3xl font-bold mb-2">You're All Set!</h1>
        <div className="gold-divider mx-auto mb-5" />
        <div className="bg-stone-800/50 rounded-sm p-5 mb-6 text-left space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-stone-500">Confirmation Code</span><span className="text-gold-400 font-mono font-semibold">{success.confirmationCode}</span></div>
          <div className="flex justify-between"><span className="text-stone-500">Room</span><span className="text-stone-200">{success.room?.name}</span></div>
          <div className="flex justify-between"><span className="text-stone-500">Check In</span><span className="text-stone-200">{new Date(success.checkIn).toLocaleDateString('en-US',{weekday:'short',month:'long',day:'numeric'})}</span></div>
          <div className="flex justify-between"><span className="text-stone-500">Check Out</span><span className="text-stone-200">{new Date(success.checkOut).toLocaleDateString('en-US',{weekday:'short',month:'long',day:'numeric'})}</span></div>
          <div className="flex justify-between border-t border-stone-700 pt-3"><span className="text-stone-400 font-medium">Total Paid</span><span className="text-gold-400 font-semibold text-base">${success.totalAmount}</span></div>
        </div>
        <p className="text-xs text-stone-500 mb-6">A confirmation has been sent to {user?.email}. Present your confirmation code at check-in.</p>
        <div className="flex gap-3">
          <button onClick={() => navigate('/my-reservations')} className="btn-gold flex-1 text-xs py-3">View My Reservations</button>
          <button onClick={() => navigate('/')} className="btn-outline flex-1 text-xs py-3">Back to Home</button>
        </div>
      </div>
    </div>
  )

  if (!room) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" /></div>

  const subtotal = room.price * nights
  const taxes = Math.round(subtotal * 0.12)
  const total = subtotal + taxes

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-stone-400 hover:text-gold-400 transition-colors text-sm mb-8 mt-4">
          <FiArrowLeft size={14} /> Back
        </button>

        <div className="mb-10">
          <p className="eyebrow mb-3">Complete Your Reservation</p>
          <h1 className="font-display text-4xl font-bold">Book Your Stay</h1>
          <div className="gold-divider mt-4" />
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-8">
            {/* Dates */}
            <div className="card-dark p-6">
              <h2 className="font-display text-xl font-semibold mb-5">Stay Details</h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="label-gold">Check In *</label>
                  <input type="date" className="input-dark" value={form.checkIn} min={new Date().toISOString().split('T')[0]}
                    onChange={set('checkIn')} required />
                </div>
                <div>
                  <label className="label-gold">Check Out *</label>
                  <input type="date" className="input-dark" value={form.checkOut} min={form.checkIn}
                    onChange={set('checkOut')} required />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-gold">Adults</label>
                  <select className="input-dark" value={form.adults} onChange={set('adults')}>
                    {[1,2,3,4].map(n => <option key={n} value={n}>{n} Adult{n>1?'s':''}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-gold">Children</label>
                  <select className="input-dark" value={form.children} onChange={set('children')}>
                    {[0,1,2,3].map(n => <option key={n} value={n}>{n} {n===1?'Child':'Children'}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Special requests */}
            <div className="card-dark p-6">
              <h2 className="font-display text-xl font-semibold mb-5">Special Requests</h2>
              <textarea rows={3} placeholder="Room preferences, dietary requirements, anniversary arrangements..." 
                className="input-dark resize-none" value={form.specialRequests} onChange={set('specialRequests')} />
              <p className="text-xs text-stone-600 mt-2">Special requests cannot be guaranteed but we will do our best to accommodate.</p>
            </div>

            {/* Payment */}
            <div className="card-dark p-6">
              <h2 className="font-display text-xl font-semibold mb-2">Payment</h2>
              <p className="text-xs text-stone-500 mb-5">This is a demo. No real payment will be processed.</p>
              <div className="space-y-4">
                <div>
                  <label className="label-gold">Card Number</label>
                  <input type="text" placeholder="4242 4242 4242 4242" className="input-dark font-mono" value={form.cardNumber}
                    onChange={e => setForm(f => ({...f, cardNumber: e.target.value.replace(/\D/g,'').replace(/(.{4})/g,'$1 ').trim().slice(0,19)}))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-gold">Expiry</label>
                    <input type="text" placeholder="MM/YY" className="input-dark" value={form.cardExpiry} onChange={set('cardExpiry')} maxLength={5} />
                  </div>
                  <div>
                    <label className="label-gold">CVC</label>
                    <input type="text" placeholder="123" className="input-dark" value={form.cardCvc} onChange={set('cardCvc')} maxLength={3} />
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading || nights < 1} className="btn-gold w-full py-4 text-sm">
              {loading ? <div className="w-5 h-5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin mx-auto" /> : `Confirm & Pay $${total || '—'}`}
            </button>
          </form>

          {/* Summary */}
          <div className="lg:col-span-2">
            <div className="card-dark sticky top-28">
              <div className="h-44 overflow-hidden">
                <img src={room.images?.[0] || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80&auto=format&fit=crop'}
                  alt={room.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <p className="eyebrow mb-1">{room.type}</p>
                <h3 className="font-display text-xl font-semibold mb-4">{room.name}</h3>
                <div className="space-y-2.5 text-sm mb-5">
                  {[
                    ['Check In', form.checkIn ? new Date(form.checkIn).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : '—'],
                    ['Check Out', form.checkOut ? new Date(form.checkOut).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : '—'],
                    ['Duration', nights ? `${nights} night${nights>1?'s':''}` : '—'],
                  ].map(([k,v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-stone-500">{k}</span>
                      <span className="text-stone-200">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-stone-700/50 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-stone-400"><span>${room.price} × {nights || 0} nights</span><span>${subtotal || 0}</span></div>
                  <div className="flex justify-between text-stone-400"><span>Taxes (12%)</span><span>${taxes || 0}</span></div>
                  <div className="flex justify-between font-semibold text-stone-100 text-base pt-2 border-t border-stone-700/50">
                    <span>Total</span><span className="text-gold-400">${total || 0}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-stone-700/50">
                  {['Free cancellation (48h before)', 'Complimentary breakfast', '24/7 concierge access'].map(f => (
                    <div key={f} className="flex items-center gap-2 text-xs text-stone-500 mb-1.5">
                      <FiCheck size={10} className="text-gold-500 shrink-0" /> {f}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}