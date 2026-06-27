import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div style={{
          position: 'absolute', top: '-20%', right: '-10%',
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(232,100,42,0.12) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute', bottom: '-20%', left: '-10%',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(240,168,84,0.08) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />
        {/* Grid lines */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative z-10 text-center max-w-2xl">
        {/* Logo mark */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl accent-gradient flex items-center justify-center mr-4">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M4 20L6 12H26L28 20H4Z" fill="white" fillOpacity="0.9"/>
              <rect x="7" y="20" width="18" height="5" rx="1" fill="white"/>
              <circle cx="10" cy="26" r="2.5" fill="white"/>
              <circle cx="22" cy="26" r="2.5" fill="white"/>
              <path d="M8 12L10 6H22L24 12" stroke="white" strokeWidth="1.5" fill="none"/>
            </svg>
          </div>
          <div className="text-left">
            
            <h1 className="text-2xl font-display font-800 text-white leading-none">CarRent</h1>
          </div>
        </div>

        <h1 className="font-display text-5xl md:text-7xl font-800 mb-4 leading-tight" style={{fontWeight: 800}}>
          Premium Car<br/>
          <span style={{
            background: 'linear-gradient(135deg, #e8642a, #f0a854)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Rental System</span>
        </h1>

        <p className="text-lg mb-12" style={{color: 'rgba(240,237,232,0.5)', fontWeight: 300}}>
          A complete car rental management solution for administrators and customers.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Admin Login */}
          <button
            onClick={() => navigate('/admin/login')}
            className="glass card-hover rounded-2xl p-6 text-left group cursor-pointer border border-transparent"
          >
            <div className="w-10 h-10 rounded-xl accent-gradient flex items-center justify-center mb-4">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 10C12.21 10 14 8.21 14 6C14 3.79 12.21 2 10 2C7.79 2 6 3.79 6 6C6 8.21 7.79 10 10 10Z" fill="white"/>
                <path d="M10 12C5.99 12 2 14 2 16V18H18V16C18 14 14.01 12 10 12Z" fill="white"/>
                <rect x="14" y="12" width="6" height="6" rx="1" fill="#e8642a"/>
                <path d="M15 15L16.5 16.5L19 14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="font-display font-700 text-white mb-1" style={{fontWeight: 700}}>Admin Login</h3>
            <p className="text-sm" style={{color: 'rgba(240,237,232,0.45)'}}>Manage fleet, rentals & customers</p>
          </button>

          {/* User Login */}
          <button
            onClick={() => navigate('/user/login')}
            className="glass card-hover rounded-2xl p-6 text-left group cursor-pointer border border-transparent"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{background: 'rgba(255,255,255,0.08)'}}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 10C12.21 10 14 8.21 14 6C14 3.79 12.21 2 10 2C7.79 2 6 3.79 6 6C6 8.21 7.79 10 10 10Z" fill="rgba(240,237,232,0.7)"/>
                <path d="M10 12C5.99 12 2 14 2 16V18H18V16C18 14 14.01 12 10 12Z" fill="rgba(240,237,232,0.7)"/>
              </svg>
            </div>
            <h3 className="font-display font-700 text-white mb-1" style={{fontWeight: 700}}>User Login</h3>
            <p className="text-sm" style={{color: 'rgba(240,237,232,0.45)'}}>Rent and manage your vehicles</p>
          </button>

          {/* User Register */}
          <button
            onClick={() => navigate('/user/register')}
            className="glass card-hover rounded-2xl p-6 text-left group cursor-pointer border border-transparent"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{background: 'rgba(255,255,255,0.08)'}}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M8 10C10.21 10 12 8.21 12 6C12 3.79 10.21 2 8 2C5.79 2 4 3.79 4 6C4 8.21 5.79 10 8 10Z" fill="rgba(240,237,232,0.7)"/>
                <path d="M8 12C3.99 12 0 14 0 16V18H16V16C16 14 12.01 12 8 12Z" fill="rgba(240,237,232,0.7)"/>
                <circle cx="16" cy="5" r="4" fill="#e8642a"/>
                <path d="M14 5H18M16 3V7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="font-display font-700 text-white mb-1" style={{fontWeight: 700}}>Register</h3>
            <p className="text-sm" style={{color: 'rgba(240,237,232,0.45)'}}>Create a new customer account</p>
          </button>
        </div>

        
      </div>
    </div>
  )
}
