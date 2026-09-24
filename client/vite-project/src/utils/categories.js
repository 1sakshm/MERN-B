export const mergeCategories = (currentCategories, products) => {
  const discovered = products.map((product) => product.category).filter(Boolean)
  return [...new Set([...currentCategories, ...discovered])]
}
