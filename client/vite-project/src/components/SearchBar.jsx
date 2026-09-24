function SearchBar({ search, category, categories, onSearchChange, onCategoryChange }) {
  return (
    <div className="product-filters">
      <label className="search-field">
        <span className="sr-only">Search products</span>
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search products..."
        />
      </label>
      <label className="category-filter">
        <span className="sr-only">Filter by category</span>
        <select value={category} onChange={(event) => onCategoryChange(event.target.value)}>
          <option value="">All Categories</option>
          {categories.map((categoryName) => <option key={categoryName} value={categoryName}>{categoryName}</option>)}
        </select>
      </label>
    </div>
  )
}

export default SearchBar
