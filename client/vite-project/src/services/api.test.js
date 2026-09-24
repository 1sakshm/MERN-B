import assert from 'node:assert/strict'
import test from 'node:test'
import { getProducts } from './api.js'

test('encodes non-empty product filters in the listing request', async () => {
  const originalFetch = global.fetch
  let requestedUrl = ''
  global.fetch = async (url) => {
    requestedUrl = url
    return new Response(JSON.stringify({ success: true, count: 0, products: [] }), { status: 200 })
  }

  try {
    await getProducts({ search: 'wire less', category: 'Home' })
    assert.equal(requestedUrl, 'http://localhost:8001/products?search=wire+less&category=Home')
  } finally {
    global.fetch = originalFetch
  }
})

test('surfaces an API error message when product loading fails', async () => {
  const originalFetch = global.fetch
  global.fetch = async () =>
    new Response(JSON.stringify({ message: 'Unable to load products.' }), { status: 500 })

  try {
    await assert.rejects(getProducts(), { message: 'Unable to load products.' })
  } finally {
    global.fetch = originalFetch
  }
})
