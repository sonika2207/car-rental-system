import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API

export default function UserRegister() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const { name, email, password, confirm } = form
    if (!name || !email || !password || !confirm) { setError('All fields are required'); return }
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 4) { setError('Password must be at least 4 characters'); return }
    setLoading(true)
    try {
      const res = await axios.post(`${API}/user/register`, { name, email, password })
      if (res.data.success) {
        sessionStorage.setItem('userId', res.data.user_id)
        sessionStorage.setItem('userName', res.data.name)
        navigate('/user/dashboard')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 30% 50%, rgba(232,100,42,0.07) 0%, transparent 60%)'
      }} />

      <div className="glass rounded-3xl p-8 w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{background: 'rgba(255,255,255,0.08)'}}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M11 14C13.8 14 16 11.8 16 9C16 6.2 13.8 4 11 4C8.2 4 6 6.2 6 9C6 11.8 8.2 14 11 14Z" fill="rgba(240,237,232,0.8)"/>
              <path d="M11 16C6 16 1 18.5 1 21V24H21V21C21 18.5 16 16 11 16Z" fill="rgba(240,237,232,0.8)"/>
              <circle cx="22" cy="7" r="5" fill="#e8642a"/>
              <path d="M20 7H24M22 5V9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="font-display text-2xl font-800 text-white" style={{fontWeight: 800}}>Create Account</h1>
          <p className="text-sm mt-1" style={{color: 'rgba(240,237,232,0.45)'}}>Join CarRent and start renting today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
            { name: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com' },
            { name: 'password', label: 'Password', type: 'password', placeholder: 'Min 4 characters' },
            { name: 'confirm', label: 'Confirm Password', type: 'password', placeholder: 'Repeat password' },
          ].map(({ name, label, type, placeholder }) => (
            <div key={name}>
              <label className="block text-xs font-display uppercase tracking-widest mb-2" style={{color: 'rgba(240,237,232,0.45)'}}>{label}</label>
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '14px' }}
              />
            </div>
          ))}

          {error && (
            <div className="rounded-xl px-4 py-3 text-sm" style={{background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171'}}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 rounded-xl text-sm cursor-pointer mt-2">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm" style={{color: 'rgba(240,237,232,0.4)'}}>
            Already have an account?{' '}
            <Link to="/user/login" style={{color: '#e8642a'}}>Login</Link>
          </p>
          <Link to="/" className="block text-sm" style={{color: 'rgba(240,237,232,0.25)'}}>← Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
