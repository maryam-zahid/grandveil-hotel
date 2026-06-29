import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FiStar, FiUsers, FiMaximize2, FiArrowLeft, FiCheck } from 'react-icons/fi'
import { MdKingBed, MdPool, MdWifi, MdLocalDining } from 'react-icons/md'
import { useAuth } from '../context/AuthContext'

const ICON_MAP = { 'WiFi': MdWifi, 'Pool': MdPool, 'Dining': MdLocalDining }

export default function RoomDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [room, setRoom] = useState(null)
  const [reviews, setReviews] = useState([])
  const [imgIdx, setImgIdx] = useState(0)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [loading, setLoading] = useState(true)

  const FALLBACK_IMGS = [
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=85&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=900&q=85&auto=format&fit=crop',
  ]

  useEffect(() => {
    Promise.all([axios.get(`/rooms/${id}`), axios.get(`/reviews/room/${id}`)])
      .then(([r, rev]) => { setRoom(r.data); setReviews(rev.data) })
      .catch(() => navigate('/rooms'))
      .finally(() => setLoading(false))
  }, [id])

  const nights = checkIn && checkOut
    ? Math.max(0, Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000))
    : 0

  const handleBook = () => {
    if (!user) return navigate('/login')
    const params = new URLSearchParams()
    if (checkIn) params.set('checkIn', checkIn)
    if (checkOut) params.set('checkOut', checkOut)
    navigate(`/book/${id}?${params}`)
  }

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!room) return null

  const images = room.images?.length ? room.images : FALLBACK_IMGS

  return (
    <div className="min-h-screen pt-20 pb-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back */}
        <Link to="/rooms" className="flex items-center gap-2 text-stone-400 hover:text-gold-400 transition-colors text-sm mb-8 mt-4">
          <FiArrowLeft size={14} /> Back to Rooms
        </Link>

        {/* Image gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-12 rounded-sm overflow-hidden h-80 md:h-[500px]">
          <div className="md:col-span-2 relative overflow-hidden cursor-pointer" onClick={() => setImgIdx(i => (i+1) % images.length)}>
            <img src={images[imgIdx]} alt={room.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
            <div className="absolute bottom-3 right-3 bg-stone-950/80 text-xs text-stone-400 px-2 py-1 rounded-sm">
              {imgIdx+1} / {images.length} · Click to cycle
            </div>
          </div>
          <div className="hidden md:grid grid-rows-2 gap-2">
            {images.slice(1, 3).map((src, i) => (
              <div key={i} className="overflow-hidden cursor-pointer" onClick={() => setImgIdx(i+1)}>
                <img src={src} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Left: details */}
          <div className="lg:col-span-2">
            <div className="flex flex-wrap items-start gap-4 justify-between mb-4">
              <div>
                <p className="eyebrow mb-2">{room.type} · Room {room.roomNumber}</p>
                <h1 className="font-display text-4xl md:text-5xl font-bold">{room.name}</h1>
              </div>
              {room.rating > 0 && (
                <div className="flex items-center gap-2 bg-gold-600/10 border border-gold-500/20 px-4 py-2">
                  <FiStar className="text-gold-400 fill-gold-400" size={16} />
                  <span className="font-display text-xl font-semibold text-gold-400">{room.rating}</span>
                  <span className="text-xs text-stone-500">({room.reviewCount} reviews)</span>
                </div>
              )}
            </div>
            <div className="gold-divider mb-6" />

            {/* Quick specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { Icon: FiUsers, label: 'Capacity', val: `${room.capacity} Guests` },
                { Icon: MdKingBed, label: 'Bed Type', val: room.bedType },
                { Icon: FiMaximize2, label: 'Room Size', val: room.size ? `${room.size} sq ft` : 'Spacious' },
                { Icon: MdPool, label: 'View', val: `${room.view} View` },
              ].map(({ Icon, label, val }) => (
                <div key={label} className="card-dark p-4 text-center">
                  <Icon className="text-gold-500 mx-auto mb-1.5" size={18} />
                  <p className="text-xs text-stone-500 mb-0.5">{label}</p>
                  <p className="text-sm font-medium text-stone-200">{val}</p>
                </div>
              ))}
            </div>

            <h2 className="font-display text-xl font-semibold mb-3">About This Room</h2>
            <p className="text-stone-400 leading-relaxed mb-8">{room.description}</p>

            {/* Amenities */}
            {room.amenities?.length > 0 && (
              <div className="mb-8">
                <h2 className="font-display text-xl font-semibold mb-4">Room Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {room.amenities.map(a => (
                    <div key={a} className="flex items-center gap-2.5 text-sm text-stone-400">
                      <FiCheck size={12} className="text-gold-500 shrink-0" /> {a}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div>
              <h2 className="font-display text-xl font-semibold mb-5">Guest Reviews ({reviews.length})</h2>
              {reviews.length === 0
                ? <p className="text-stone-500 text-sm">No reviews yet for this room.</p>
                : reviews.map(r => (
                  <div key={r._id} className="card-dark p-5 mb-3">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium text-stone-200 text-sm">{r.user?.name}</p>
                        <div className="flex gap-0.5 mt-1">
                          {Array(r.rating).fill(0).map((_, i) => <FiStar key={i} size={10} className="text-gold-400 fill-gold-400" />)}
                        </div>
                      </div>
                      <p className="text-xs text-stone-600">{new Date(r.createdAt).toLocaleDateString('en-US',{month:'short',year:'numeric'})}</p>
                    </div>
                    <p className="font-semibold text-sm mb-1">{r.title}</p>
                    <p className="text-stone-400 text-sm leading-relaxed">{r.comment}</p>
                  </div>
                ))
              }
            </div>
          </div>

          {/* Right: booking widget */}
          <div className="lg:col-span-1">
            <div className="card-dark p-6 sticky top-28">
              <div className="mb-5">
                <span className="font-display text-4xl font-bold text-gold-400">${room.price}</span>
                <span className="text-stone-500 text-sm ml-1">/ night</span>
              </div>
              <div className="gold-divider mb-5" />

              <div className="space-y-3 mb-4">
                <div>
                  <label className="label-gold">Check In</label>
                  <input type="date" className="input-dark" value={checkIn}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setCheckIn(e.target.value)} />
                </div>
                <div>
                  <label className="label-gold">Check Out</label>
                  <input type="date" className="input-dark" value={checkOut}
                    min={checkIn || new Date().toISOString().split('T')[0]}
                    onChange={e => setCheckOut(e.target.value)} />
                </div>
              </div>

              {nights > 0 && (
                <div className="bg-stone-800/50 p-4 rounded-sm mb-4 space-y-2 text-sm">
                  <div className="flex justify-between text-stone-400">
                    <span>${room.price} × {nights} night{nights>1?'s':''}</span>
                    <span>${room.price * nights}</span>
                  </div>
                  <div className="flex justify-between text-stone-400">
                    <span>Taxes & fees (12%)</span>
                    <span>${Math.round(room.price * nights * 0.12)}</span>
                  </div>
                  <div className="border-t border-stone-700 pt-2 flex justify-between font-semibold text-stone-100">
                    <span>Total</span>
                    <span className="text-gold-400">${Math.round(room.price * nights * 1.12)}</span>
                  </div>
                </div>
              )}

              <button onClick={handleBook} className="btn-gold w-full py-4 text-sm">
                {user ? 'Reserve This Room' : 'Sign In to Book'}
              </button>

              <p className="text-center text-xs text-stone-600 mt-3">Free cancellation up to 48 hours before check-in</p>

              <div className="mt-5 pt-5 border-t border-stone-700/50 space-y-2">
                {['Best Rate Guarantee', 'Secure Payment', '24/7 Concierge Support'].map(f => (
                  <div key={f} className="flex items-center gap-2 text-xs text-stone-500">
                    <FiCheck size={11} className="text-gold-500" /> {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}