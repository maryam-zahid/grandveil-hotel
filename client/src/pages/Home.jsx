import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FiSearch, FiArrowRight, FiStar, FiWifi, FiCoffee, FiAward } from 'react-icons/fi'
import { MdPool, MdSpa, MdRestaurant, MdLocalParking } from 'react-icons/md'

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1800&q=90&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1800&q=90&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1800&q=90&auto=format&fit=crop',
]

const AMENITIES = [
  { icon: MdPool, label: 'Infinity Pool', desc: 'Rooftop infinity pool with panoramic views' },
  { icon: MdSpa, label: 'Luxury Spa', desc: 'World-class treatments and wellness rituals' },
  { icon: MdRestaurant, label: 'Fine Dining', desc: 'Three Michelin-starred restaurant on premises' },
  { icon: FiWifi, label: 'Connectivity', desc: 'Seamless high-speed internet throughout' },
  { icon: FiCoffee, label: 'Concierge', desc: '24/7 personal concierge at your service' },
  { icon: MdLocalParking, label: 'Valet Parking', desc: 'Complimentary valet for all guests' },
]

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) } })
    }, { threshold: 0.1 })
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

export default function Home() {
  const [heroIdx, setHeroIdx] = useState(0)
  const [rooms, setRooms] = useState([])
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)
  const navigate = useNavigate()
  useReveal()

  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i + 1) % HERO_IMAGES.length), 5000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    axios.get('/rooms').then(r => setRooms(r.data.slice(0, 3))).catch(() => {})
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (checkIn) params.set('checkIn', checkIn)
    if (checkOut) params.set('checkOut', checkOut)
    if (guests) params.set('capacity', guests)
    navigate(`/rooms?${params}`)
  }

  return (
    <div className="overflow-x-hidden">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {HERO_IMAGES.map((img, i) => (
          <div key={i} className={`absolute inset-0 transition-opacity duration-2000 ${i === heroIdx ? 'opacity-100' : 'opacity-0'}`}>
            <img src={img} alt="Hotel" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-stone-950/60 via-stone-950/40 to-stone-950/80" />
          </div>
        ))}

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <p className="eyebrow animate-fade-in mb-5">Welcome to GrandVeil</p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-stone-50 leading-tight mb-6 animate-fade-up">
            Where Luxury<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-200">
              Becomes Legend
            </span>
          </h1>
          <p className="text-stone-300 text-lg md:text-xl max-w-xl mx-auto mb-10 font-light leading-relaxed animate-fade-up" style={{animationDelay:'0.15s'}}>
            An address of distinction. An experience of a lifetime. Reserve your suite among the world's finest.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{animationDelay:'0.3s'}}>
            <Link to="/rooms" className="btn-gold text-xs py-4 px-10 tracking-widest">Explore Rooms</Link>
            <a href="#amenities" className="btn-outline text-xs py-4 px-10 tracking-widest">Discover More</a>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-14">
            {HERO_IMAGES.map((_, i) => (
              <button key={i} onClick={() => setHeroIdx(i)}
                className={`h-px transition-all duration-500 ${i === heroIdx ? 'w-8 bg-gold-400' : 'w-4 bg-stone-500'}`} />
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-px h-10 bg-gradient-to-b from-transparent to-gold-500" />
        </div>
      </section>

      {/* SEARCH BAR */}
      <section className="relative z-20 -mt-1 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <form onSubmit={handleSearch} className="bg-stone-900/90 backdrop-blur-md border border-stone-700/50 rounded-sm p-6 shadow-2xl shadow-black/50">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="label-gold">Check In</label>
                <input type="date" className="input-dark" value={checkIn} min={new Date().toISOString().split('T')[0]}
                  onChange={e => setCheckIn(e.target.value)} />
              </div>
              <div>
                <label className="label-gold">Check Out</label>
                <input type="date" className="input-dark" value={checkOut} min={checkIn || new Date().toISOString().split('T')[0]}
                  onChange={e => setCheckOut(e.target.value)} />
              </div>
              <div>
                <label className="label-gold">Guests</label>
                <select className="input-dark" value={guests} onChange={e => setGuests(e.target.value)}>
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Guest{n>1?'s':''}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" className="btn-gold w-full gap-2 py-3.5">
              <FiSearch size={15} /> Check Availability
            </button>
          </form>
        </div>
      </section>

      {/* ABOUT STRIP */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="reveal">
            <p className="eyebrow mb-4">Our Legacy</p>
            <h2 className="section-title mb-5">A Sanctuary of<br />Unrivalled Elegance</h2>
            <div className="gold-divider" />
            <p className="text-stone-400 leading-relaxed mb-4">For over four decades, GrandVeil has stood as the foremost address for discerning travelers who demand nothing less than perfection. From the hand-selected thread count of our linens to the provenance of each ingredient in our kitchen, every detail is a deliberate act of excellence.</p>
            <p className="text-stone-400 leading-relaxed mb-8">Nestled between the azure Mediterranean and the mountains, our estate is both a retreat from the world and a gateway to it.</p>
            <Link to="/rooms" className="btn-gold inline-flex gap-2 text-xs py-3 px-8">
              Explore Rooms <FiArrowRight size={14} />
            </Link>
          </div>
          <div className="reveal grid grid-cols-2 gap-3">
            {[
              'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&q=85&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&q=85&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=500&q=85&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&q=85&auto=format&fit=crop',
            ].map((src, i) => (
              <div key={i} className={`room-img-zoom overflow-hidden rounded-sm ${i === 1 ? 'mt-8' : i === 3 ? '-mt-8' : ''}`}>
                <img src={src} alt="Hotel" className="w-full h-48 object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 border-y border-stone-800/60">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[['40+', 'Years of Excellence'], ['12', 'Award-Winning Suites'], ['3', 'Michelin Stars'], ['98%', 'Guest Satisfaction']].map(([n, l]) => (
              <div key={l} className="reveal">
                <div className="font-display text-4xl md:text-5xl font-bold text-gold-400 mb-2">{n}</div>
                <p className="text-xs tracking-widest uppercase text-stone-500">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED ROOMS */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 reveal">
            <p className="eyebrow mb-4">Our Accommodation</p>
            <h2 className="section-title mb-4">Curated Rooms & Suites</h2>
            <div className="gold-divider mx-auto" />
          </div>

          {rooms.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {rooms.map((room, i) => (
                <Link key={room._id} to={`/rooms/${room._id}`}
                  className="card-dark group overflow-hidden reveal cursor-pointer hover:border-gold-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gold-500/5"
                  style={{animationDelay: `${i*0.1}s`}}>
                  <div className="room-img-zoom h-56">
                    <img src={room.images?.[0] || `https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80&auto=format&fit=crop`}
                      alt={room.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-sm px-2.5 py-1 text-xs text-gold-400 tracking-wider border border-gold-500/20">
                      {room.type}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-display text-xl font-semibold group-hover:text-gold-300 transition-colors">{room.name}</h3>
                      {room.rating > 0 && <div className="flex items-center gap-1 text-gold-400 text-xs"><FiStar size={10} />{room.rating}</div>}
                    </div>
                    <p className="text-stone-500 text-sm mb-4 line-clamp-2">{room.description}</p>
                    <div className="flex justify-between items-center pt-4 border-t border-stone-700/50">
                      <div>
                        <span className="font-display text-2xl font-semibold text-gold-400">${room.price}</span>
                        <span className="text-xs text-stone-500 ml-1">/ night</span>
                      </div>
                      <span className="text-xs text-gold-500 group-hover:gap-2 flex items-center gap-1 transition-all">
                        View <FiArrowRight size={11} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {[
                { name: 'Deluxe King Room', type: 'Deluxe', price: 450, desc: 'Opulent king-sized suite with city views, marble bath, and private terrace.' },
                { name: 'Grand Ocean Suite', type: 'Suite', price: 850, desc: 'Floor-to-ceiling ocean panoramas, butler service, and a private jacuzzi.' },
                { name: 'Presidential Suite', type: 'Presidential', price: 2400, desc: 'The pinnacle of luxury. A full floor of private residence with all amenities.' },
              ].map((room, i) => (
                <Link key={i} to="/rooms"
                  className="card-dark group overflow-hidden reveal cursor-pointer hover:border-gold-500/30 transition-all duration-300 hover:-translate-y-1"
                  style={{animationDelay: `${i*0.1}s`}}>
                  <div className="room-img-zoom h-56">
                    <img src={[
                      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80&auto=format&fit=crop',
                      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80&auto=format&fit=crop',
                      'https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=600&q=80&auto=format&fit=crop',
                    ][i]} alt={room.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-sm px-2.5 py-1 text-xs text-gold-400 tracking-wider border border-gold-500/20">{room.type}</div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-gold-300 transition-colors">{room.name}</h3>
                    <p className="text-stone-500 text-sm mb-4">{room.desc}</p>
                    <div className="flex justify-between items-center pt-4 border-t border-stone-700/50">
                      <div><span className="font-display text-2xl font-semibold text-gold-400">${room.price}</span><span className="text-xs text-stone-500 ml-1">/ night</span></div>
                      <span className="text-xs text-gold-500 flex items-center gap-1">View <FiArrowRight size={11} /></span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center reveal">
            <Link to="/rooms" className="btn-outline inline-flex gap-2 text-xs py-3 px-10">
              View All Rooms <FiArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* AMENITIES */}
      <section id="amenities" className="py-24 px-4 bg-stone-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 reveal">
            <p className="eyebrow mb-4">Hotel Facilities</p>
            <h2 className="section-title mb-4">World-Class Amenities</h2>
            <div className="gold-divider mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {AMENITIES.map(({ icon: Icon, label, desc }, i) => (
              <div key={label} className="card-dark p-6 reveal group hover:border-gold-500/30 transition-all duration-300 hover:-translate-y-1"
                style={{animationDelay: `${i*0.08}s`}}>
                <div className="w-12 h-12 border border-gold-500/30 flex items-center justify-center mb-4 group-hover:border-gold-400/60 group-hover:bg-gold-500/5 transition-all duration-300">
                  <Icon className="text-gold-500 text-xl group-hover:text-gold-400 transition-colors" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-gold-300 transition-colors">{label}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 reveal">
            <p className="eyebrow mb-4">Guest Reviews</p>
            <h2 className="section-title mb-4">What Our Guests Say</h2>
            <div className="gold-divider mx-auto" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Catherine L.', origin: 'London, UK', rating: 5, text: 'GrandVeil is not merely a hotel — it is a place where time slows and beauty reveals itself in every detail. The suites are incomparable.' },
              { name: 'James R.', origin: 'New York, USA', rating: 5, text: 'From the moment the car pulled up, the experience was flawless. The staff remembered my name, my preferences, my stories. Extraordinary.' },
              { name: 'Sofia M.', origin: 'Milan, Italy', rating: 5, text: 'The spa alone is worth crossing continents for. Combined with the cuisine and the views, GrandVeil is simply without equal.' },
            ].map(({ name, origin, rating, text }, i) => (
              <div key={name} className="card-dark p-8 reveal" style={{animationDelay:`${i*0.1}s`}}>
                <div className="flex gap-0.5 mb-4">
                  {Array(rating).fill(0).map((_, j) => <FiStar key={j} size={12} className="text-gold-400 fill-gold-400" />)}
                </div>
                <p className="text-stone-400 text-sm leading-relaxed mb-6 italic">"{text}"</p>
                <div className="border-t border-stone-700/50 pt-4">
                  <p className="font-display font-semibold text-stone-200">{name}</p>
                  <p className="text-xs text-stone-600 mt-0.5">{origin}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section id="contact" className="relative py-32 px-4 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1800&q=85&auto=format&fit=crop"
          alt="Hotel" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-stone-950/80" />
        <div className="relative z-10 text-center max-w-2xl mx-auto reveal">
          <p className="eyebrow mb-5">Begin Your Journey</p>
          <h2 className="section-title mb-5">Reserve Your Suite Today</h2>
          <div className="gold-divider mx-auto mb-6" />
          <p className="text-stone-400 mb-10 leading-relaxed">Every stay at GrandVeil is a story waiting to be written. Let us craft yours with unparalleled care and attention.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/rooms" className="btn-gold text-xs py-4 px-10 tracking-widest">Reserve Now</Link>
            <a href="tel:+18000008345" className="btn-outline text-xs py-4 px-10 tracking-widest">Call Concierge</a>
          </div>
        </div>
      </section>
    </div>
  )
}