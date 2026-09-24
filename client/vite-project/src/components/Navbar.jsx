import { Link, NavLink } from 'react-router-dom'

function Navbar({ user, onLogout }) {
  return (
    <header className="shop-header">
      <Link className="shop-brand" to="/home" aria-label="ShopKart home">
        <span className="brand-mark">S</span>
        <span>ShopKart</span>
      </Link>
      <nav className="shop-nav" aria-label="Main navigation">
        <NavLink to="/home">Home</NavLink>
        <NavLink to="/products">Shop</NavLink>
      </nav>
      <div className="header-actions">
        <span className="welcome-text">Welcome {user?.fullname}</span>
        <button type="button" className="logout-btn" onClick={onLogout}>Logout</button>
      </div>
    </header>
  )
}

export default Navbar
