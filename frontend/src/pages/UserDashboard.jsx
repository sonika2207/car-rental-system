import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = 'http://localhost:5000'

function SectionHeader({ title }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-1 h-6 rounded-full accent-gradient" />
      <h2 className="font-display text-lg font-700 text-white" style={{fontWeight: 700}}>{title}</h2>
    </div>
  )
}

function BillModal({ bill, onClose }) {
  if (!bill) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)'}}>
      <div className="glass rounded-3xl p-8 w-full max-w-sm text-center">
        <div className="w-14 h-14 rounded-2xl accent-gradient flex items-center justify-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect x="4" y="2" width="20" height="24" rx="2" fill="white" fillOpacity="0.9"/>
            <path d="M8 8H20M8 12H20M8 16H14" stroke="#e8642a" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <h2 className="font-display text-xl font-800 text-white mb-1" style={{fontWeight: 800}}>Rental Bill</h2>
        <p className="text-xs mb-6" style={{color: 'rgba(240,237,232,0.4)', fontFamily: 'monospace'}}>BOOKING CONFIRMED</p>

        <div className="text-left space-y-3 mb-6 rounded-2xl p-4" style={{background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)'}}>
          {[
            ['Car', `${bill.car_name} (${bill.brand})`],
            ['Customer', bill.customer_name || 'N/A'],
            ['Duration', `${bill.days} day${bill.days > 1 ? 's' : ''}`],
            ['Rate', `₹${bill.price_per_day}/day`],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between items-center">
              <span className="text-xs font-display uppercase tracking-wider" style={{color: 'rgba(240,237,232,0.45)'}}>{k}</span>
              <span className="text-sm text-white">{v}</span>
            </div>
          ))}
          <div className="border-t pt-3 flex justify-between items-center" style={{borderColor: 'rgba(255,255,255,0.08)'}}>
            <span className="font-display text-sm uppercase tracking-wider" style={{color: '#e8642a'}}>Total Amount</span>
            <span className="font-display text-xl font-800 text-white" style={{fontWeight: 800}}>₹{bill.total_price}</span>
          </div>
        </div>

        <button onClick={onClose} className="btn-primary w-full py-3 rounded-xl text-sm cursor-pointer">
          Close
        </button>
      </div>
    </div>
  )
}

export default function UserDashboard() {
  const navigate = useNavigate()
  const userId = sessionStorage.getItem('userId')
  const userName = sessionStorage.getItem('userName')

  const [cars, setCars] = useState([])
  const [myRentals, setMyRentals] = useState([])
  const [activeTab, setActiveTab] = useState('cars')
  const [bill, setBill] = useState(null)

  // Rent form
  const [rentForm, setRentForm] = useState({ name: '', phone: '', car_id: '', days: '' })
  const [rentMsg, setRentMsg] = useState('')
  const [rentError, setRentError] = useState('')

  // Return form
  const [returnCarId, setReturnCarId] = useState('')
  const [returnMsg, setReturnMsg] = useState('')
  const [returnError, setReturnError] = useState('')

  useEffect(() => {
    if (!userId) { navigate('/user/login'); return }
    fetchData()
  }, [])

  const fetchData = async () => {
    const [c, r] = await Promise.all([
      axios.get(`${API}/available_cars`),
      axios.get(`${API}/rentals/user/${userId}`)
    ])
    setCars(c.data)
    setMyRentals(r.data)
  }

  const handleRent = async (e) => {
    e.preventDefault()
    setRentMsg(''); setRentError('')
    const { name, phone, car_id, days } = rentForm
    if (!name || !phone || !car_id || !days) { setRentError('All fields are required'); return }
    if (parseInt(days) < 1) { setRentError('Days must be at least 1'); return }
    try {
      const res = await axios.post(`${API}/rent_car`, {
        customer_id: parseInt(userId),
        name, phone, car_id: parseInt(car_id), days: parseInt(days)
      })
      if (res.data.success) {
        setRentMsg('Car rented successfully!')
        setBill({ ...res.data, customer_name: name })
        setRentForm({ name: '', phone: '', car_id: '', days: '' })
        fetchData()
      }
    } catch (err) {
      setRentError(err.response?.data?.message || 'Failed to rent car')
    }
  }

  const handleReturn = async (e) => {
    e.preventDefault()
    setReturnMsg(''); setReturnError('')
    if (!returnCarId) { setReturnError('Car ID is required'); return }
    try {
      const res = await axios.post(`${API}/return_car`, { car_id: parseInt(returnCarId) })
      if (res.data.success) {
        setReturnMsg('Car returned successfully!')
        setReturnCarId('')
        fetchData()
      }
    } catch (err) {
      setReturnError(err.response?.data?.message || 'Failed to return car')
    }
  }

  const logout = () => {
    sessionStorage.clear()
    navigate('/')
  }

  const tabs = ['cars', 'rent', 'return', 'history']
  const tabLabels = { cars: 'Available Cars', rent: 'Rent a Car', return: 'Return Car', history: 'My Rentals' }

  return (
    <div className="min-h-screen">
      {bill && <BillModal bill={bill} onClose={() => setBill(null)} />}

      {/* Navbar */}
      <nav className="glass sticky top-0 z-40 px-6 py-4 flex items-center justify-between" style={{borderBottom: '1px solid rgba(255,255,255,0.08)'}}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg accent-gradient flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 10L3 6H13L14 10H2Z" fill="white"/>
              <rect x="3.5" y="10" width="9" height="3" rx="0.5" fill="white"/>
              <circle cx="5" cy="13.5" r="1.5" fill="white"/>
              <circle cx="11" cy="13.5" r="1.5" fill="white"/>
            </svg>
          </div>
          <span className="font-display font-700 text-white" style={{fontWeight: 700}}>CarRent</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm hidden sm:block" style={{color: 'rgba(240,237,232,0.5)'}}>
            Hello, <span style={{color: '#e8642a'}}>{userName}</span>
          </span>
          <button onClick={logout} className="btn-secondary px-4 py-2 rounded-xl text-sm cursor-pointer">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="glass rounded-2xl p-5">
            <p className="text-xs font-display uppercase tracking-widest mb-2" style={{color: 'rgba(240,237,232,0.4)'}}>Available Cars</p>
            <p className="font-display text-3xl font-800" style={{fontWeight: 800, color: '#4ade80'}}>{cars.length}</p>
          </div>
          <div className="glass rounded-2xl p-5">
            <p className="text-xs font-display uppercase tracking-widest mb-2" style={{color: 'rgba(240,237,232,0.4)'}}>My Rentals</p>
            <p className="font-display text-3xl font-800" style={{fontWeight: 800, color: '#e8642a'}}>{myRentals.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-2 rounded-xl text-sm cursor-pointer transition-all font-display"
              style={activeTab === tab
                ? {background: 'linear-gradient(135deg, #e8642a, #f0a854)', color: 'white', fontWeight: 600}
                : {background: 'rgba(255,255,255,0.06)', color: 'rgba(240,237,232,0.6)', border: '1px solid rgba(255,255,255,0.08)', fontWeight: 600}
              }
            >
              {tabLabels[tab]}
            </button>
          ))}
        </div>

        {/* Available Cars */}
        {activeTab === 'cars' && (
          <div className="glass rounded-2xl overflow-hidden">
            <div className="p-5 border-b" style={{borderColor: 'rgba(255,255,255,0.08)'}}>
              <SectionHeader title="Available Cars" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{background: 'rgba(255,255,255,0.03)'}}>
                    {['Car ID', 'Name', 'Brand', 'Price/Day (₹)', 'Status'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-display uppercase tracking-widest" style={{color: 'rgba(240,237,232,0.4)', fontWeight: 600}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cars.length === 0 ? (
                    <tr><td colSpan={5} className="px-5 py-8 text-center" style={{color: 'rgba(240,237,232,0.3)'}}>No cars available right now</td></tr>
                  ) : cars.map(car => (
                    <tr key={car.car_id}>
                      <td className="px-5 py-3 font-mono text-sm" style={{color: '#e8642a'}}>#{car.car_id}</td>
                      <td className="px-5 py-3 text-white">{car.car_name}</td>
                      <td className="px-5 py-3" style={{color: 'rgba(240,237,232,0.6)'}}>{car.brand}</td>
                      <td className="px-5 py-3 text-white">₹{car.price_per_day}</td>
                      <td className="px-5 py-3">
                        <span className="text-xs px-2 py-1 rounded-full status-available">Available</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Rent a Car */}
        {activeTab === 'rent' && (
          <div className="glass rounded-2xl p-6 max-w-xl">
            <SectionHeader title="Rent a Car" />
            <form onSubmit={handleRent} className="space-y-4">
              {[
                { key: 'name', label: 'Your Name', type: 'text', placeholder: 'John Doe' },
                { key: 'phone', label: 'Phone Number', type: 'text', placeholder: '9876543210' },
                { key: 'car_id', label: 'Car ID', type: 'number', placeholder: 'Enter Car ID from available list' },
                { key: 'days', label: 'Number of Days', type: 'number', placeholder: 'e.g. 3' },
              ].map(({ key, label, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-display uppercase tracking-widest mb-2" style={{color: 'rgba(240,237,232,0.45)'}}>{label}</label>
                  <input
                    type={type}
                    value={rentForm[key]}
                    onChange={e => setRentForm(prev => ({ ...prev, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '14px' }}
                  />
                </div>
              ))}

              {rentMsg && <div className="rounded-xl px-4 py-3 text-sm" style={{background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', color: '#4ade80'}}>{rentMsg}</div>}
              {rentError && <div className="rounded-xl px-4 py-3 text-sm" style={{background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171'}}>{rentError}</div>}

              <button type="submit" className="btn-primary w-full py-3 rounded-xl text-sm cursor-pointer">
                Confirm Rental
              </button>
            </form>
          </div>
        )}

        {/* Return Car */}
        {activeTab === 'return' && (
          <div className="glass rounded-2xl p-6 max-w-md">
            <SectionHeader title="Return a Car" />
            <form onSubmit={handleReturn} className="space-y-4">
              <div>
                <label className="block text-xs font-display uppercase tracking-widest mb-2" style={{color: 'rgba(240,237,232,0.45)'}}>Car ID to Return</label>
                <input
                  type="number"
                  value={returnCarId}
                  onChange={e => setReturnCarId(e.target.value)}
                  placeholder="Enter Car ID"
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '14px' }}
                />
              </div>

              {returnMsg && <div className="rounded-xl px-4 py-3 text-sm" style={{background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', color: '#4ade80'}}>{returnMsg}</div>}
              {returnError && <div className="rounded-xl px-4 py-3 text-sm" style={{background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171'}}>{returnError}</div>}

              <button type="submit" className="btn-primary w-full py-3 rounded-xl text-sm cursor-pointer">
                Return Car
              </button>
            </form>
          </div>
        )}

        {/* My Rentals */}
        {activeTab === 'history' && (
          <div className="glass rounded-2xl overflow-hidden">
            <div className="p-5 border-b" style={{borderColor: 'rgba(255,255,255,0.08)'}}>
              <SectionHeader title="My Rental History" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{background: 'rgba(255,255,255,0.03)'}}>
                    {['Rental ID', 'Car', 'Days', 'Total (₹)'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-display uppercase tracking-widest" style={{color: 'rgba(240,237,232,0.4)', fontWeight: 600}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {myRentals.length === 0 ? (
                    <tr><td colSpan={4} className="px-5 py-8 text-center" style={{color: 'rgba(240,237,232,0.3)'}}>No rentals yet. Go rent a car!</td></tr>
                  ) : myRentals.map(r => (
                    <tr key={r.rental_id}>
                      <td className="px-5 py-3 font-mono text-sm" style={{color: '#e8642a'}}>#{r.rental_id}</td>
                      <td className="px-5 py-3 text-white">{r.car_name} <span style={{color: 'rgba(240,237,232,0.4)', fontSize: '12px'}}>({r.brand})</span></td>
                      <td className="px-5 py-3" style={{color: 'rgba(240,237,232,0.6)'}}>{r.days}</td>
                      <td className="px-5 py-3 font-600 text-white">₹{r.total_price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
