import { useEffect, useState } from 'react'
import './App.css'

const initialForm = {
  fullname: '',
  email: '',
  password: '',
  phone: '',
  confirmPassword: '',
}

function App() {
  const [isLogin, setIsLogin] = useState(true)
  const [user, setUser] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const resetStatus = () => setStatus({ type: '', message: '' })

  const navigateTo = (path) => {
    window.history.pushState({}, '', path)
    setCurrentPath(path)
  }

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('http://localhost:8001/customers/me', {
        method: 'GET',
        credentials: 'include',
      })

      if (!response.ok) {
        setUser(null)
        return false
      }

      const data = await response.json()
      setUser(data.authenticatedCustomer || null)
      return true
    } catch (error) {
      setUser(null)
      return false
    }
  }

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname)
    window.addEventListener('popstate', handlePopState)

    if (window.location.pathname === '/home') {
      fetchCurrentUser()
    }

    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    resetStatus()
    setLoading(true)

    try {
      const response = await fetch('http://localhost:8001/customers/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        const message = data.message || 'Login failed'

        if (message === 'Customer not found') {
          setStatus({ type: 'error', message: "Person doesn't exist" })
        } else if (message === 'Invalid email or password') {
          setStatus({ type: 'error', message: 'Incorrect password' })
        } else {
          setStatus({ type: 'error', message })
        }

        return
      }

      const loggedIn = await fetchCurrentUser()
      if (loggedIn) {
        setForm(initialForm)
        setStatus({ type: 'success', message: 'Logged in successfully' })
        navigateTo('/home')
      } else {
        setStatus({ type: 'error', message: 'Login succeeded but user profile could not be loaded.' })
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Unable to connect to the server. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (event) => {
    event.preventDefault()
    resetStatus()
    setLoading(true)

    if (form.password !== form.confirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match' })
      setLoading(false)
      return
    }

    try {
      const response = await fetch('http://localhost:8001/customers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          fullname: form.fullname,
          email: form.email,
          password: form.password,
          phone: form.phone,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setStatus({
          type: 'error',
          message: data.message || 'Registration failed',
        })
        return
      }

      const registeredUser = await fetchCurrentUser()
      setStatus({ type: 'success', message: 'Registration successful' })
      setIsLogin(true)
      setForm(initialForm)

      if (registeredUser) {
        navigateTo('/home')
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Unable to register right now. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  const switchToLogin = () => {
    setIsLogin(true)
    resetStatus()
    setForm(initialForm)
    navigateTo('/')
  }

  const switchToRegister = () => {
    setIsLogin(false)
    resetStatus()
    setForm(initialForm)
    navigateTo('/')
  }

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8001/customers/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setUser(null)
      setStatus({ type: 'success', message: 'Logged out successfully' })
      setIsLogin(true)
      setForm(initialForm)
      navigateTo('/')
    }
  }

  if (currentPath === '/home' && user) {
    return (
      <div className="shop-page">
        <header className="shop-header">
          <div className="shop-brand">
            <span className="brand-mark">S</span>
            <span>Shopkart</span>
          </div>

          <nav className="shop-nav" aria-label="Main navigation">
            <a href="#">Home</a>
            <a href="#">Shop</a>
            <a href="#">Deals</a>
            <a href="#">New Arrivals</a>
          </nav>

          <div className="header-actions">
            <span className="welcome-text">Welcome {user.fullname}</span>
            <button type="button" className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <main className="shop-main">
          <section className="hero-section">
            <div className="hero-copy">
              <span className="eyebrow">New season collection</span>
              <h1>Welcome {user.fullname}</h1>
              <p>
                Fresh styles, everyday essentials, and trending picks curated for your lifestyle.
              </p>

              <div className="cta-row">
                <button type="button" className="cta-primary">Shop now</button>
                <button type="button" className="cta-secondary">Explore deals</button>
              </div>

              <div className="stats-row">
                <div>
                  <strong>25K+</strong>
                  <span>happy customers</span>
                </div>
                <div>
                  <strong>4.9/5</strong>
                  <span>average rating</span>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-card big-card">
                <span className="tag">Trending</span>
                <h3>Urban Flex</h3>
                <p>From $89</p>
              </div>
              <div className="hero-card small-card">
                <span>Free shipping</span>
                <strong>On orders over $99</strong>
              </div>
            </div>
          </section>

          <section className="products-section">
            <div className="section-heading">
              <div>
                <span className="mini-label">Popular picks</span>
                <h2>Featured products</h2>
              </div>
              <a href="#">View all</a>
            </div>

            <div className="product-grid">
              <article className="product-card">
                <div className="product-image image-one" />
                <div className="product-info">
                  <span className="category">Footwear</span>
                  <h3>Nova Runner</h3>
                  <div className="price-row">
                    <strong>$120</strong>
                    <span>$160</span>
                  </div>
                </div>
              </article>

              <article className="product-card">
                <div className="product-image image-two" />
                <div className="product-info">
                  <span className="category">Accessories</span>
                  <h3>Luna Bag</h3>
                  <div className="price-row">
                    <strong>$84</strong>
                    <span>$110</span>
                  </div>
                </div>
              </article>

              <article className="product-card">
                <div className="product-image image-three" />
                <div className="product-info">
                  <span className="category">Wearables</span>
                  <h3>Pulse Watch</h3>
                  <div className="price-row">
                    <strong>$180</strong>
                    <span>$240</span>
                  </div>
                </div>
              </article>

              <article className="product-card">
                <div className="product-image image-four" />
                <div className="product-info">
                  <span className="category">Essentials</span>
                  <h3>Cozy Hoodie</h3>
                  <div className="price-row">
                    <strong>$72</strong>
                    <span>$95</span>
                  </div>
                </div>
              </article>
            </div>
          </section>
        </main>
      </div>
    )
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand">MyApp</div>
          <div className="mode-switch" role="tablist" aria-label="Authentication options">
            <button
              type="button"
              className={isLogin ? 'tab active' : 'tab'}
              onClick={switchToLogin}
            >
              Login
            </button>
            <button
              type="button"
              className={!isLogin ? 'tab active' : 'tab'}
              onClick={switchToRegister}
            >
              Register
            </button>
          </div>
        </div>

        {status.message && (
          <div className={status.type === 'success' ? 'alert success' : 'alert error'}>
            {status.message}
          </div>
        )}

        {isLogin ? (
          <form className="auth-form" onSubmit={handleLogin}>
            <h1>Welcome back</h1>
            <p className="subtitle">Sign in to continue</p>

            <label>
              <span>Email</span>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <span>Password</span>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </label>

            <div className="row-between">
              <label className="checkbox-row">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#" className="link">Forgot password?</a>
            </div>

            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? 'Please wait...' : 'Login'}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleRegister}>
            <h1>Create account</h1>
            <p className="subtitle">Register to get started</p>

            <label>
              <span>Full name</span>
              <input
                type="text"
                name="fullname"
                placeholder="John Doe"
                value={form.fullname}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <span>Email</span>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <span>Phone</span>
              <input
                type="tel"
                name="phone"
                placeholder="9876543210"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <span>Password</span>
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <span>Confirm password</span>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Repeat your password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </label>

            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default App
