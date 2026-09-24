const API_BASE_URL = 'http://localhost:8001'

const request = async (path) => {
  const response = await fetch(`${API_BASE_URL}${path}`, { credentials: 'include' })
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const error = new Error(data.message || 'Request failed.')
    error.status = response.status
    throw error
  }

  return data
}

export const getProducts = (filters = {}) => {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(filters)) {
    if (typeof value === 'string' && value.trim()) params.set(key, value.trim())
  }

  const query = params.toString()
  return request(`/products${query ? `?${query}` : ''}`)
}

export const getProductById = (id) => request(`/products/${id}`)
