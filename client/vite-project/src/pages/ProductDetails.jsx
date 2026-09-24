import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProductById } from '../services/api.js'

function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    const loadProduct = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await getProductById(id)
        if (active) setProduct(data.product)
      } catch (requestError) {
        if (active) setError(requestError.status === 404 ? 'Product not found.' : 'Something went wrong while loading this product.')
      } finally {
        if (active) setLoading(false)
      }
    }
    loadProduct()
    return () => { active = false }
  }, [id])

  if (loading) return <main className="catalogue-page"><p className="state-panel">Loading product...</p></main>
  if (error) return <main className="catalogue-page"><p className="state-panel error-state">{error}</p><Link to="/products">Back to products</Link></main>

  return (
    <main className="catalogue-page">
      <Link className="back-link" to="/products">← Back to products</Link>
      <article className="product-detail">
        <img src={product.image} alt={product.name} />
        <div className="product-detail-copy">
          <span className="category">{product.category}</span>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <strong className="detail-price">₹{Number(product.price).toLocaleString('en-IN')}</strong>
          <span className={product.stock > 0 ? 'stock-status available' : 'stock-status unavailable'}>{product.stock > 0 ? `${product.stock} units in stock` : 'Out of stock'}</span>
          <button type="button" className="cta-primary" disabled={product.stock === 0}>Add to Cart</button>
        </div>
      </article>
    </main>
  )
}

export default ProductDetails
