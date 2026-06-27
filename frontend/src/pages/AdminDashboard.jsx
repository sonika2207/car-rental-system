import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

const API = 'http://localhost:5000'

function StatCard({ label, value, color }) {
  return (
    <div className="glass rounded-2xl p-5 card-hover">
      <p className="text-xs font-display uppercase tracking-widest mb-2" style={{color: 'rgba(240,237,232,0.4)'}}>{label}</p>
      <p className="font-display text-3xl font-800 text-white" style={{fontWeight: 800, color: color || '#f0ede8'}}>{value}</p>
    </div>
  )
}

function SectionHeader({ title }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-1 h-6 rounded-full accent-gradient" />
      <h2 className="font-display text-lg font-700 text-white" style={{fontWeight: 700}}>{title}</h2>
    </div>
  )
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [cars, setCars] = useState([])
  const [rentals, setRentals] = useState([])
  const [customers, setCustomers] = useState([])
  const [activeTab, setActiveTab] = useState('cars')
  const [addCarForm, setAddCarForm] = useState({ car_id: '', car_name: '', brand: '', price_per_day: '', status: 'Available' })
  const [addMsg, setAddMsg] = useState('')
  const [addError, setAddError] = useState('')

  useEffect(() => {
    if (sessionStorage.getItem('adminAuth') !== 'true') {
      navigate('/admin/login')
      return
    }
    fetchAll()
  }, [])

  const fetchAll = async () => {
    const [c, r, cu] = await Promise.all([
      axios.get(`${API}/cars`),
      axios.get(`${API}/rentals`),
      axios.get(`${API}/customers`)
    ])
    setCars(c.data)
    setRentals(r.data)
    setCustomers(cu.data)
  }

  const handleAddCar = async (e) => {
    e.preventDefault()
    setAddMsg(''); setAddError('')
    const { car_id, car_name, brand, price_per_day } = addCarForm
    if (!car_id || !car_name || !brand || !price_per_day) {
      setAddError('All fields are required'); return
    }
    try {
      const res = await axios.post(`${API}/add_car`, { ...addCarForm, price_per_day: parseInt(price_per_day) })
      if (res.data.success) {
        setAddMsg('Car added successfully!')
        setAddCarForm({ car_id: '', car_name: '', brand: '', price_per_day: '', status: 'Available' })
        fetchAll()
      }
    } catch (err) {
      setAddError(err.response?.data?.message || 'Failed to add car')
    }
  }

  const logout = () => {
    sessionStorage.removeItem('adminAuth')
    navigate('/')
  }

  const availableCount = cars.filter(c => c.status === 'Available').length
  const rentedCount = cars.filter(c => c.status === 'Rented').length

  const tabs = ['cars', 'add_car', 'rentals', 'customers']
  const tabLabels = { cars: 'All Cars', add_car: 'Add Car', rentals: 'Rentals', customers: 'Customers' }

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between" style={{borderBottom: '1px solid rgba(255,255,255,0.08)'}}>
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
          <span className="text-xs px-2 py-0.5 rounded-full" style={{background: 'rgba(232,100,42,0.2)', color: '#e8642a', fontFamily: 'monospace'}}>ADMIN</span>
        </div>
        <button onClick={logout} className="btn-secondary px-4 py-2 rounded-xl text-sm cursor-pointer">
          Logout
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Cars" value={cars.length} />
          <StatCard label="Available" value={availableCount} color="#4ade80" />
          <StatCard label="Rented" value={rentedCount} color="#f87171" />
          <StatCard label="Customers" value={customers.length} color="#60a5fa" />
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

        {/* All Cars */}
        {activeTab === 'cars' && (
          <div className="glass rounded-2xl overflow-hidden">
            <div className="p-5 border-b" style={{borderColor: 'rgba(255,255,255,0.08)'}}>
              <SectionHeader title="All Cars" />
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
                    <tr><td colSpan={5} className="px-5 py-8 text-center" style={{color: 'rgba(240,237,232,0.3)'}}>No cars found</td></tr>
                  ) : cars.map(car => (
                    <tr key={car.car_id}>
                      <td className="px-5 py-3 font-mono text-sm" style={{color: '#e8642a'}}>#{car.car_id}</td>
                      <td className="px-5 py-3 text-white font-500">{car.car_name}</td>
                      <td className="px-5 py-3" style={{color: 'rgba(240,237,232,0.6)'}}>{car.brand}</td>
                      <td className="px-5 py-3 text-white">₹{car.price_per_day}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${car.status === 'Available' ? 'status-available' : 'status-rented'}`}>
                          {car.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add Car */}
        {activeTab === 'add_car' && (
          <div className="glass rounded-2xl p-6 max-w-xl">
            <SectionHeader title="Add New Car" />
            <form onSubmit={handleAddCar} className="space-y-4">
              {[
                { key: 'car_id', label: 'Car ID', type: 'number', placeholder: 'e.g. 101' },
                { key: 'car_name', label: 'Car Name', type: 'text', placeholder: 'e.g. City' },
                { key: 'brand', label: 'Brand', type: 'text', placeholder: 'e.g. Honda' },
                { key: 'price_per_day', label: 'Price Per Day (₹)', type: 'number', placeholder: 'e.g. 2000' },
              ].map(({ key, label, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-display uppercase tracking-widest mb-2" style={{color: 'rgba(240,237,232,0.45)'}}>{label}</label>
                  <input
                    type={type}
                    value={addCarForm[key]}
                    onChange={e => setAddCarForm(prev => ({ ...prev, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-600"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '14px' }}
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-display uppercase tracking-widest mb-2" style={{color: 'rgba(240,237,232,0.45)'}}>Status</label>
                <select
                  value={addCarForm.status}
                  onChange={e => setAddCarForm(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl text-white"
                  style={{ background: 'rgba(30,30,40)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '14px' }}
                >
                  <option value="Available">Available</option>
                  <option value="Rented">Rented</option>
                </select>
              </div>

              {addMsg && <div className="rounded-xl px-4 py-3 text-sm" style={{background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', color: '#4ade80'}}>{addMsg}</div>}
              {addError && <div className="rounded-xl px-4 py-3 text-sm" style={{background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171'}}>{addError}</div>}

              <button type="submit" className="btn-primary w-full py-3 rounded-xl text-sm cursor-pointer">Add Car</button>
            </form>
          </div>
        )}

        {/* Rentals */}
        {activeTab === 'rentals' && (
          <div className="glass rounded-2xl overflow-hidden">
            <div className="p-5 border-b" style={{borderColor: 'rgba(255,255,255,0.08)'}}>
              <SectionHeader title="All Rentals" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{background: 'rgba(255,255,255,0.03)'}}>
                    {['Rental ID', 'Car', 'Customer', 'Phone', 'Days', 'Total (₹)'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-display uppercase tracking-widest" style={{color: 'rgba(240,237,232,0.4)', fontWeight: 600}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rentals.length === 0 ? (
                    <tr><td colSpan={6} className="px-5 py-8 text-center" style={{color: 'rgba(240,237,232,0.3)'}}>No rentals found</td></tr>
                  ) : rentals.map(r => (
                    <tr key={r.rental_id}>
                      <td className="px-5 py-3 font-mono text-sm" style={{color: '#e8642a'}}>#{r.rental_id}</td>
                      <td className="px-5 py-3 text-white">{r.car_name} <span style={{color: 'rgba(240,237,232,0.4)', fontSize: '12px'}}>({r.brand})</span></td>
                      <td className="px-5 py-3 text-white">{r.customer_name}</td>
                      <td className="px-5 py-3" style={{color: 'rgba(240,237,232,0.6)'}}>{r.phone}</td>
                      <td className="px-5 py-3" style={{color: 'rgba(240,237,232,0.6)'}}>{r.days}</td>
                      <td className="px-5 py-3 font-600 text-white">₹{r.total_price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Customers */}
        {activeTab === 'customers' && (
          <div className="glass rounded-2xl overflow-hidden">
            <div className="p-5 border-b" style={{borderColor: 'rgba(255,255,255,0.08)'}}>
              <SectionHeader title="All Customers" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{background: 'rgba(255,255,255,0.03)'}}>
                    {['Customer ID', 'Name', 'Phone'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-display uppercase tracking-widest" style={{color: 'rgba(240,237,232,0.4)', fontWeight: 600}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {customers.length === 0 ? (
                    <tr><td colSpan={3} className="px-5 py-8 text-center" style={{color: 'rgba(240,237,232,0.3)'}}>No customers found</td></tr>
                  ) : customers.map(c => (
                    <tr key={c.customer_id}>
                      <td className="px-5 py-3 font-mono text-sm" style={{color: '#e8642a'}}>#{c.customer_id}</td>
                      <td className="px-5 py-3 text-white">{c.name}</td>
                      <td className="px-5 py-3" style={{color: 'rgba(240,237,232,0.6)'}}>{c.phone}</td>
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
