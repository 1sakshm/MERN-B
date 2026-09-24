import { Link } from 'react-router-dom'

function Home({ user }) {
  return (
    <main className="shop-main">
      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">New season collection</span>
          <h1>Welcome {user.fullname}</h1>
          <p>Fresh styles, everyday essentials, and trending picks curated for your lifestyle.</p>
          <div className="cta-row">
            <Link className="cta-primary" to="/products">Shop now</Link>
            <Link className="cta-secondary" to="/products">Explore products</Link>
          </div>
          <div className="stats-row">
            <div><strong>25K+</strong><span>happy customers</span></div>
            <div><strong>4.9/5</strong><span>average rating</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card big-card"><span className="tag">Discover</span><h3>Find your next favourite</h3><p>Products selected for you</p></div>
          <div className="hero-card small-card"><span>Free shipping</span><strong>On orders over ₹999</strong></div>
        </div>
      </section>
      <section className="home-products-cta">
        <div><span className="mini-label">Browse the catalogue</span><h2>Everything ShopKart has to offer.</h2></div>
        <Link className="details-btn" to="/products">View all products</Link>
      </section>
    </main>
  )
}

export default Home
