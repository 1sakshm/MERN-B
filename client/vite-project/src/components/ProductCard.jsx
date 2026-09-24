import { Link } from 'react-router-dom'

function ProductCard({ product }) {
  const inStock = product.stock > 0

  return (
    <article className="catalogue-card">
      <img className="catalogue-image" src={product.image} alt={product.name} />
      <div className="catalogue-info">
        <span className="category">{product.category}</span>
        <h2>{product.name}</h2>
        <strong className="product-price">₹{Number(product.price).toLocaleString('en-IN')}</strong>
        <span className={inStock ? 'stock-status available' : 'stock-status unavailable'}>
          {inStock ? `${product.stock} units left` : 'Out of stock'}
        </span>
        <Link className="details-btn" to={`/products/${product._id}`}>View Details</Link>
      </div>
    </article>
  )
}

export default ProductCard
