import { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard.jsx'
import SearchBar from '../components/SearchBar.jsx'
import { getProducts } from '../services/api.js'
import { mergeCategories } from '../utils/categories.js'

const defaultCategories = ['Electronics', 'Fashion', 'Books', 'Home']

function Products() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState(defaultCategories)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    const timeoutId = window.setTimeout(async () => {
      setLoading(true)
      setError('')
      try {
        const data = await getProducts({ search, category })
        if (active) {
          const loadedProducts = data.products || []
          setProducts(loadedProducts)
          setCategories((currentCategories) => mergeCategories(currentCategories, loadedProducts))
        }
      } catch (requestError) {
        if (active) setError(requestError.message)
      } finally {
        if (active) setLoading(false)
      }
    }, 300)

    return () => {
      active = false
      window.clearTimeout(timeoutId)
    }
  }, [search, category])

  return (
    <main className="catalogue-page">
      <div className="catalogue-heading"><span className="mini-label">ShopKart catalogue</span><h1>Find what you need</h1><p>Search products or browse by category.</p></div>
      <SearchBar search={search} category={category} categories={categories} onSearchChange={setSearch} onCategoryChange={setCategory} />
      {loading && <p className="state-panel">Loading products...</p>}
      {!loading && error && <p className="state-panel error-state">Something went wrong while loading products.</p>}
      {!loading && !error && products.length === 0 && <p className="state-panel">No products found.</p>}
      {!loading && !error && products.length > 0 && <div className="catalogue-grid">{products.map((product) => <ProductCard key={product._id} product={product} />)}</div>}
    </main>
  )
}

export default Products
