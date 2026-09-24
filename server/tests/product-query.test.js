import assert from 'node:assert/strict'
import test from 'node:test'
import { buildProductQuery } from '../utils/product-query.js'

test('treats search punctuation as literal product-name text', () => {
  const query = buildProductQuery({ search: 'headphones (' })

  assert.equal(query.name.$regex, 'headphones \\(')
  assert.equal(query.name.$options, 'i')
})

test('combines normalized name search and category filters', () => {
  assert.deepEqual(buildProductQuery({ search: ' keyboard ', category: ' Electronics ' }), {
    name: { $regex: 'keyboard', $options: 'i' },
    category: 'Electronics',
  })
})
