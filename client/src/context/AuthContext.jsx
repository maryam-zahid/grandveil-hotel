import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

// Axios defaults
axios.defaults.baseURL = '/api'
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('gv_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
axios.interceptors.response.use(r => r, err => {
  if (err.response?.status === 401) {
    localStorage.removeItem('gv_token')
    window.location.href = '/login'
  }
  return Promise.reject(err)
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('gv_token')
    if (token) {
      axios.get('/auth/me')
        .then(r => setUser(r.data))
        .catch(() => localStorage.removeItem('gv_token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const { data } = await axios.post('/auth/login', { email, password })
    localStorage.setItem('gv_token', data.token)
    setUser(data.user)
    return data.user
  }

  const register = async (name, email, password, phone) => {
    const { data } = await axios.post('/auth/register', { name, email, password, phone })
    localStorage.setItem('gv_token', data.token)
    setUser(data.user)
    return data.user
  }

  const logout = () => {
    localStorage.removeItem('gv_token')
    setUser(null)
    toast.success('Signed out successfully')
  }

  const updateProfile = async (updates) => {
    const { data } = await axios.put('/auth/me', updates)
    setUser(data)
    return data
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)