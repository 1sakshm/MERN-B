const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const buildProductQuery = ({ search, category }) => {
  const query = {}

  if (typeof search === 'string' && search.trim()) {
    query.name = { $regex: escapeRegex(search.trim()), $options: 'i' }
  }

  if (typeof category === 'string' && category.trim()) {
    query.category = category.trim()
  }

  return query
}
