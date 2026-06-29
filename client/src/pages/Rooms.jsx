import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { FiStar, FiFilter, FiX, FiUsers, FiMaximize2 } from 'react-icons/fi'
import { MdKingBed } from 'react-icons/md'

const TYPES = ['All', 'Standard', 'Deluxe', 'Suite', 'Presidential']
const VIEWS = ['All', 'Ocean', 'City', 'Garden', 'Pool', 'Mountain']

function RoomSkeleton() {
  return (
    <div className="card-dark overflow-hidden animate-pulse">
      <div className="h-56 bg-stone-800" />
      <div className="p-6 space-y-3">
        <div className="h-5 bg-stone-800 rounded w-3/4" />
        <div className="h-4 bg-stone-800 rounded w-full" />
        <div className="h-4 bg-stone-800 rounded w-2/3" />
        <div className="h-8 bg-stone-800 rounded w-1/3 mt-4" />
      </div>
    </div>
  )
}

export default function Rooms() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterOpen, setFilterOpen] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()

  const [filters, setFilters] = useState({
    type: 'All',
    view: 'All',
    minPrice: '',
    maxPrice: '',
    capacity: searchParams.get('capacity') || '',
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
  })

  const fetchRooms = async () => {
    setLoading(true)
    try {
      const params = {}
      if (filters.type !== 'All') params.type = filters.type
      if (filters.view !== 'All') params.view = filters.view
      if (filters.minPrice) params.minPrice = filters.minPrice
      if (filters.maxPrice) params.maxPrice = filters.maxPrice
      if (filters.capacity) params.capacity = filters.capacity
      if (filters.checkIn) params.checkIn = filters.checkIn
      if (filters.checkOut) params.checkOut = filters.checkOut
      const { data } = await axios.get('/rooms', { params })
      setRooms(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchRooms() }, [])

  const applyFilters = (e) => {
    e.preventDefault()
    fetchRooms()
    setFilterOpen(false)
  }

  const clearFilters = () => {
    setFilters({ type: 'All', view: 'All', minPrice: '', maxPrice: '', capacity: '', checkIn: '', checkOut: '' })
    setSearchParams({})
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="eyebrow mb-4">Our Accommodation</p>
          <h1 className="section-title mb-4">Rooms & Suites</h1>
          <div className="gold-divider mx-auto mb-4" />
          <p className="text-stone-400 max-w-xl mx-auto text-sm leading-relaxed">
            Each room is a masterpiece — designed with intention, furnished with heritage pieces, and equipped with every modern luxury.
          </p>
        </div>

        {/* Quick type tabs */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {TYPES.map(t => (
            <button key={t} onClick={() => setFilters(f => ({...f, type: t}))}
              className={`px-5 py-2 text-xs tracking-widest uppercase transition-all duration-200 rounded-sm border ${
                filters.type === t
                  ? 'bg-gold-600 text-stone-950 border-gold-600'
                  : 'border-stone-700/50 text-stone-400 hover:border-gold-500/40 hover:text-gold-400'
              }`}>{t}</button>
          ))}
          <button onClick={() => setFilterOpen(v => !v)}
            className="px-5 py-2 text-xs tracking-widest uppercase border border-stone-700/50 text-stone-400 hover:border-gold-500/40 hover:text-gold-400 transition-all flex items-center gap-2 rounded-sm ml-2">
            <FiFilter size={12} /> Filters
          </button>
        </div>

        {/* Filter panel */}
        {filterOpen && (
          <div className="card-dark p-6 mb-8 animate-fade-in">
            <form onSubmit={applyFilters}>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                <div>
                  <label className="label-gold">View</label>
                  <select className="input-dark" value={filters.view} onChange={e => setFilters(f => ({...f, view: e.target.value}))}>
                    {VIEWS.map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-gold">Min Price</label>
                  <input type="number" className="input-dark" placeholder="$0" value={filters.minPrice}
                    onChange={e => setFilters(f => ({...f, minPrice: e.target.value}))} />
                </div>
                <div>
                  <label className="label-gold">Max Price</label>
                  <input type="number" className="input-dark" placeholder="$9999" value={filters.maxPrice}
                    onChange={e => setFilters(f => ({...f, maxPrice: e.target.value}))} />
                </div>
                <div>
                  <label className="label-gold">Guests</label>
                  <select className="input-dark" value={filters.capacity} onChange={e => setFilters(f => ({...f, capacity: e.target.value}))}>
                    <option value="">Any</option>
                    {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}+</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-gold">Check In</label>
                  <input type="date" className="input-dark" value={filters.checkIn}
                    onChange={e => setFilters(f => ({...f, checkIn: e.target.value}))} />
                </div>
                <div>
                  <label className="label-gold">Check Out</label>
                  <input type="date" className="input-dark" value={filters.checkOut}
                    onChange={e => setFilters(f => ({...f, checkOut: e.target.value}))} />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button type="submit" className="btn-gold text-xs py-2.5 px-6">Apply Filters</button>
                <button type="button" onClick={clearFilters} className="btn-outline text-xs py-2.5 px-6 flex items-center gap-2">
                  <FiX size={12} /> Clear
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Results count */}
        <div className="flex justify-between items-center mb-6 text-sm">
          <p className="text-stone-500">{loading ? 'Searching...' : `${rooms.length} room${rooms.length !== 1 ? 's' : ''} available`}</p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array(6).fill(0).map((_, i) => <RoomSkeleton key={i} />)
            : rooms.length === 0
              ? (
                <div className="col-span-full text-center py-20">
                  <p className="text-stone-500 text-lg mb-2">No rooms match your criteria</p>
                  <button onClick={clearFilters} className="btn-outline text-xs py-2.5 px-6 mt-4">Clear Filters</button>
                </div>
              )
              : rooms.map(room => (
                <Link key={room._id} to={`/rooms/${room._id}`}
                  className="card-dark group overflow-hidden hover:border-gold-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gold-500/5">
                  <div className="room-img-zoom relative h-56">
                    <img src={room.images?.[0] || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80&auto=format&fit=crop'}
                      alt={room.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 to-transparent" />
                    <div className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-sm px-2.5 py-1 text-xs text-gold-400 border border-gold-500/20">{room.type}</div>
                    <div className="absolute top-3 right-3 bg-stone-950/80 backdrop-blur-sm px-2.5 py-1 text-xs text-stone-300">{room.view} View</div>
                    {room.isFeatured && <div className="absolute bottom-3 right-3 bg-gold-600 px-2 py-0.5 text-xs text-stone-950 font-semibold">Featured</div>}
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-display text-xl font-semibold group-hover:text-gold-300 transition-colors leading-tight">{room.name}</h3>
                      {room.rating > 0 && (
                        <div className="flex items-center gap-1 text-gold-400 text-xs shrink-0 ml-2">
                          <FiStar size={10} className="fill-gold-400" />{room.rating}
                          <span className="text-stone-600">({room.reviewCount})</span>
                        </div>
                      )}
                    </div>
                    <p className="text-stone-500 text-sm mb-4 line-clamp-2 leading-relaxed">{room.description}</p>
                    <div className="flex items-center gap-4 text-xs text-stone-600 mb-4">
                      <span className="flex items-center gap-1"><FiUsers size={11} />{room.capacity} guests</span>
                      {room.size && <span className="flex items-center gap-1"><FiMaximize2 size={11} />{room.size} sq ft</span>}
                      <span className="flex items-center gap-1"><MdKingBed size={13} />{room.bedType}</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-stone-700/50">
                      <div>
                        <span className="font-display text-2xl font-semibold text-gold-400">${room.price}</span>
                        <span className="text-xs text-stone-500 ml-1">/ night</span>
                      </div>
                      <span className="btn-gold text-xs py-2 px-5">Book Now</span>
                    </div>
                  </div>
                </Link>
              ))
          }
        </div>
      </div>
    </div>
  )
}