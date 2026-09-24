import assert from 'node:assert/strict'
import test from 'node:test'
import { mergeCategories } from './categories.js'

test('keeps required categories and adds valid categories returned by products', () => {
  assert.deepEqual(mergeCategories(['Electronics', 'Fashion'], [{ category: 'Toys' }, { category: 'Electronics' }]), [
    'Electronics', 'Fashion', 'Toys',
  ])
})
