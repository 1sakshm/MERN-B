import assert from 'node:assert/strict'
import test from 'node:test'
import Product from '../models/product.model.js'

const validProduct = {
  name: 'Mechanical Keyboard',
  description: 'RGB mechanical keyboard with blue switches.',
  price: 2999,
  category: 'Electronics',
  image: 'https://example.com/keyboard.jpg',
  stock: 10,
}

test('rejects a product with a non-positive price', () => {
  const product = new Product({ ...validProduct, price: 0 })
  const error = product.validateSync()

  assert.ok(error?.errors.price)
})

test('accepts a product with zero stock', () => {
  const product = new Product({ ...validProduct, stock: 0 })

  assert.equal(product.validateSync(), undefined)
})

test('requires every product field used by the catalogue', () => {
  const product = new Product({ name: validProduct.name })
  const error = product.validateSync()

  for (const field of ['description', 'price', 'category', 'image', 'stock']) {
    assert.ok(error?.errors[field], `${field} should be required`)
  }
})
