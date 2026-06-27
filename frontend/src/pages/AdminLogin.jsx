import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

const API = 'http://localhost:5000'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    if (!password) { setError('Password is required'); return }
    setLoading(true)
    try {
      const res = await axios.post(`${API}/admin/login`, { password })
      if (res.data.success) {
        sessionStorage.setItem('adminAuth', 'true')
        navigate('/admin/dashboard')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, rgba(232,100,42,0.08) 0%, transparent 70%)'
      }} />

      <div className="glass rounded-3xl p-8 w-full max-w-md relative">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl accent-gradient flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 14C16.8 14 19 11.8 19 9C19 6.2 16.8 4 14 4C11.2 4 9 6.2 9 9C9 11.8 11.2 14 14 14Z" fill="white"/>
              <path d="M14 16C9 16 4 18.5 4 21V24H24V21C24 18.5 19 16 14 16Z" fill="white"/>
              <rect x="18" y="16" width="9" height="8" rx="1.5" fill="#c04a10"/>
              <path d="M20 20L22 22L26 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="font-display text-2xl font-800 text-white" style={{fontWeight: 800}}>Admin Portal</h1>
          <p className="text-sm mt-1" style={{color: 'rgba(240,237,232,0.45)'}}>Enter admin password to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-display uppercase tracking-widest mb-2" style={{color: 'rgba(240,237,232,0.5)'}}>
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                fontSize: '15px'
              }}
            />
          </div>

          {error && (
            <div className="rounded-xl px-4 py-3 text-sm" style={{background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171'}}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 rounded-xl text-sm cursor-pointer"
          >
            {loading ? 'Verifying...' : 'Login as Admin'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm" style={{color: 'rgba(240,237,232,0.35)'}}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
