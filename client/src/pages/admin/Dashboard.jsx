import { useState, useEffect } from 'react'
import axios from 'axios'
import { FiUsers, FiCalendar, FiDollarSign, FiStar, FiTrendingUp } from 'react-icons/fi'
import { MdHotel } from 'react-icons/md'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/admin/dashboard').then(r => setData(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" /></div>

  const chartData = data?.monthlyRevenue?.map(m => ({
    month: MONTH_NAMES[(m._id.month - 1)],
    revenue: m.revenue,
    bookings: m.count
  })) || []

  const stats = [
    { label: 'Total Revenue', value: `$${(data?.stats?.totalRevenue || 0).toLocaleString()}`, icon: FiDollarSign, color: 'text-gold-400', bg: 'bg-gold-500/10 border-gold-500/20' },
    { label: 'Reservations', value: data?.stats?.totalReservations || 0, icon: FiCalendar, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'Total Rooms', value: data?.stats?.totalRooms || 0, icon: MdHotel, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
    { label: 'Guests', value: data?.stats?.totalUsers || 0, icon: FiUsers, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { label: 'Reviews', value: data?.stats?.totalReviews || 0, icon: FiStar, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  ]

  const STATUS_COLORS = { pending:'text-yellow-400', confirmed:'text-green-400', 'checked-in':'text-blue-400', 'checked-out':'text-stone-400', cancelled:'text-red-400' }

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow mb-2">Overview</p>
        <h1 className="font-display text-3xl font-bold">Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`card-dark p-5 border ${bg}`}>
            <div className={`${color} mb-3`}><Icon size={20} /></div>
            <p className="font-display text-2xl font-bold mb-0.5">{value}</p>
            <p className="text-xs text-stone-500 tracking-wide">{label}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="card-dark p-6">
          <div className="flex items-center gap-2 mb-6">
            <FiTrendingUp className="text-gold-500" size={16} />
            <h2 className="font-display text-lg font-semibold">Monthly Revenue</h2>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c5a028" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#c5a028" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#78716c', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#78716c', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1c1a17', border: '1px solid rgba(197,160,40,0.2)', borderRadius: '2px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="revenue" stroke="#c5a028" fill="url(#goldGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent Reservations */}
      <div className="card-dark p-6">
        <h2 className="font-display text-lg font-semibold mb-5">Recent Reservations</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-800/60">
                {['Guest', 'Room', 'Check In', 'Amount', 'Status'].map(h => (
                  <th key={h} className="text-left pb-3 text-xs text-stone-500 tracking-widest uppercase font-medium pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(data?.recentReservations || []).map(r => (
                <tr key={r._id} className="table-row">
                  <td className="py-3 pr-4"><p className="font-medium text-stone-200">{r.user?.name}</p><p className="text-xs text-stone-600">{r.user?.email}</p></td>
                  <td className="py-3 pr-4 text-stone-400">{r.room?.name}</td>
                  <td className="py-3 pr-4 text-stone-400">{new Date(r.checkIn).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</td>
                  <td className="py-3 pr-4 text-gold-400 font-semibold">${r.totalAmount}</td>
                  <td className="py-3"><span className={`text-xs font-medium capitalize ${STATUS_COLORS[r.status]}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!data?.recentReservations?.length && <p className="text-center text-stone-600 py-8 text-sm">No reservations yet</p>}
        </div>
      </div>
    </div>
  )
}
