import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API

export default function UserLogin() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) { setError('All fields are required'); return }
    setLoading(true)
    try {
      const res = await axios.post(`${API}/user/login`, form)
      if (res.data.success) {
        sessionStorage.setItem('userId', res.data.user_id)
        sessionStorage.setItem('userName', res.data.name)
        navigate('/user/dashboard')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 70% 50%, rgba(232,100,42,0.07) 0%, transparent 60%)'
      }} />

      <div className="glass rounded-3xl p-8 w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{background: 'rgba(255,255,255,0.08)'}}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 14C16.8 14 19 11.8 19 9C19 6.2 16.8 4 14 4C11.2 4 9 6.2 9 9C9 11.8 11.2 14 14 14Z" fill="rgba(240,237,232,0.8)"/>
              <path d="M14 16C9 16 4 18.5 4 21V24H24V21C24 18.5 19 16 14 16Z" fill="rgba(240,237,232,0.8)"/>
            </svg>
          </div>
          <h1 className="font-display text-2xl font-800 text-white" style={{fontWeight: 800}}>Welcome Back</h1>
          <p className="text-sm mt-1" style={{color: 'rgba(240,237,232,0.45)'}}>Login to your CarRent account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-display uppercase tracking-widest mb-2" style={{color: 'rgba(240,237,232,0.45)'}}>Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '14px' }}
            />
          </div>
          <div>
            <label className="block text-xs font-display uppercase tracking-widest mb-2" style={{color: 'rgba(240,237,232,0.45)'}}>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '14px' }}
            />
          </div>

          {error && (
            <div className="rounded-xl px-4 py-3 text-sm" style={{background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171'}}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 rounded-xl text-sm cursor-pointer">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm" style={{color: 'rgba(240,237,232,0.4)'}}>
            Don't have an account?{' '}
            <Link to="/user/register" style={{color: '#e8642a'}}>Register</Link>
          </p>
          <Link to="/" className="block text-sm" style={{color: 'rgba(240,237,232,0.25)'}}>← Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
