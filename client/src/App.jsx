import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/shared/Layout'
import AdminLayout from './components/admin/AdminLayout'

// Public pages
import Home from './pages/Home'
import Rooms from './pages/Rooms'
import RoomDetail from './pages/RoomDetail'
import Login from './pages/Login'
import Register from './pages/Register'

// User pages
import MyReservations from './pages/user/MyReservations'
import ReservationDetail from './pages/user/ReservationDetail'
import Profile from './pages/user/Profile'
import BookingPage from './pages/user/BookingPage'

// Admin pages
import Dashboard from './pages/admin/Dashboard'
import AdminRooms from './pages/admin/AdminRooms'
import AdminReservations from './pages/admin/AdminReservations'
import AdminUsers from './pages/admin/AdminUsers'
import AdminReviews from './pages/admin/AdminReviews'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" /></div>
  return user ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  const { user, loading, isAdmin } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" /></div>
  if (!user) return <Navigate to="/login" replace />
  return isAdmin ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="rooms/:id" element={<RoomDetail />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* User Protected */}
        <Route element={<Layout />}>
          <Route path="book/:roomId" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
          <Route path="my-reservations" element={<ProtectedRoute><MyReservations /></ProtectedRoute>} />
          <Route path="my-reservations/:id" element={<ProtectedRoute><ReservationDetail /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Route>

        {/* Admin */}
        <Route path="admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="rooms" element={<AdminRooms />} />
          <Route path="reservations" element={<AdminReservations />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="reviews" element={<AdminReviews />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}