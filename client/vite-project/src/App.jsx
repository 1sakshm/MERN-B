import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import ProductDetails from './pages/ProductDetails.jsx'
import Products from './pages/Products.jsx'

const initialForm = { fullname: '', email: '', password: '', phone: '', confirmPassword: '' }
const API_BASE_URL = 'http://localhost:8001'

function AuthPage({ onAuthenticated }) {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false)
  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  const switchMode = (loginMode) => {
    setIsLogin(loginMode)
    setForm(initialForm)
    setStatus({ type: '', message: '' })
  }

  const submit = async (event) => {
    event.preventDefault()
    setStatus({ type: '', message: '' })
    if (!isLogin && form.password !== form.confirmPassword) return setStatus({ type: 'error', message: 'Passwords do not match' })
    setLoading(true)
    try {
      const endpoint = isLogin ? '/customers/login' : '/customers/register'
      const body = isLogin ? { email: form.email, password: form.password } : { fullname: form.fullname, email: form.email, password: form.password, phone: form.phone }
      const response = await fetch(`${API_BASE_URL}${endpoint}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(body) })
      const data = await response.json()
      if (!response.ok) {
        const message = data.message === 'Customer not found'
          ? "Person doesn't exist"
          : data.message === 'Invalid email or password'
            ? 'Incorrect password'
            : data.message || 'Unable to continue.'
        throw new Error(message)
      }
      const profileResponse = await fetch(`${API_BASE_URL}/customers/me`, { credentials: 'include' })
      const profile = await profileResponse.json()
      if (!profileResponse.ok || !profile.authenticatedCustomer) throw new Error('Your profile could not be loaded.')
      onAuthenticated(profile.authenticatedCustomer)
      navigate('/home')
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    } finally {
      setLoading(false)
    }
  }

  const field = (label, name, type = 'text') => <label><span>{label}</span><input type={type} name={name} value={form[name]} onChange={(event) => update(name, event.target.value)} required /></label>

  return <div className="auth-shell"><div className="auth-card">
    <div className="auth-header"><div className="brand">ShopKart</div><div className="mode-switch" role="tablist" aria-label="Authentication options"><button type="button" className={isLogin ? 'tab active' : 'tab'} onClick={() => switchMode(true)}>Login</button><button type="button" className={!isLogin ? 'tab active' : 'tab'} onClick={() => switchMode(false)}>Register</button></div></div>
    {status.message && <div className={`alert ${status.type}`}>{status.message}</div>}
    <form className="auth-form" onSubmit={submit}><h1>{isLogin ? 'Welcome back' : 'Create account'}</h1><p className="subtitle">{isLogin ? 'Sign in to start shopping' : 'Register to start shopping'}</p>{!isLogin && field('Full name', 'fullname')}{field('Email', 'email', 'email')}{!isLogin && field('Phone', 'phone', 'tel')}{field('Password', 'password', 'password')}{!isLogin && field('Confirm password', 'confirmPassword', 'password')}<button type="submit" className="primary-btn" disabled={loading}>{loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}</button></form>
  </div></div>
}

function ProtectedLayout({ user, onLogout, children }) {
  if (!user) return <Navigate to="/" replace />
  return <div className="shop-page"><Navbar user={user} onLogout={onLogout} />{children}</div>
}

function App() {
  const [user, setUser] = useState(null)
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    const loadSession = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/customers/me`, { credentials: 'include' })
        if (response.ok) setUser((await response.json()).authenticatedCustomer || null)
      } catch { setUser(null) } finally { setCheckingSession(false) }
    }
    loadSession()
  }, [])

  const logout = async () => {
    try { await fetch(`${API_BASE_URL}/customers/logout`, { method: 'POST', credentials: 'include' }) } finally { setUser(null) }
  }

  if (checkingSession) return <div className="auth-shell"><p className="state-panel">Loading ShopKart...</p></div>
  return <Routes>
    <Route path="/" element={user ? <Navigate to="/home" replace /> : <AuthPage onAuthenticated={setUser} />} />
    <Route path="/home" element={<ProtectedLayout user={user} onLogout={logout}><Home user={user} /></ProtectedLayout>} />
    <Route path="/products" element={<ProtectedLayout user={user} onLogout={logout}><Products /></ProtectedLayout>} />
    <Route path="/products/:id" element={<ProtectedLayout user={user} onLogout={logout}><ProductDetails /></ProtectedLayout>} />
    <Route path="*" element={<Navigate to={user ? '/home' : '/'} replace />} />
  </Routes>
}

export default App
