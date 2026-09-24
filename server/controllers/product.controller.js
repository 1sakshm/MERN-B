import mongoose from 'mongoose'
import Product from '../models/product.model.js'
import { buildProductQuery } from '../utils/product-query.js'

const isDatabaseReady = () => mongoose.connection.readyState === 1

const sendDatabaseUnavailable = (res) =>
  res.status(503).json({
    success: false,
    message: 'Database unavailable. Please ensure MongoDB is connected.',
  })

const sendValidationError = (res, error) =>
  res.status(400).json({
    success: false,
    message: Object.values(error.errors)
      .map((validationError) => validationError.message)
      .join(', '),
  })

export const createProduct = async (req, res) => {
  if (!isDatabaseReady()) return sendDatabaseUnavailable(res)

  try {
    const product = await Product.create(req.body)
    return res.status(201).json({ success: true, product })
  } catch (error) {
    if (error.name === 'ValidationError') return sendValidationError(res, error)
    return res.status(500).json({ success: false, message: 'Unable to create product.' })
  }
}

export const getProducts = async (req, res) => {
  if (!isDatabaseReady()) return sendDatabaseUnavailable(res)

  try {
    const { sort } = req.query
    const query = buildProductQuery(req.query)

    const sortOption = sort === 'price_asc' ? { price: 1 } : sort === 'price_desc' ? { price: -1 } : undefined
    const products = await Product.find(query)
      .select('name description price category image stock createdAt')
      .sort(sortOption)

    return res.status(200).json({ success: true, count: products.length, products })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Unable to load products.' })
  }
}

export const getProductById = async (req, res) => {
  if (!isDatabaseReady()) return sendDatabaseUnavailable(res)

  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: 'Invalid product ID.' })
  }

  try {
    const product = await Product.findById(id).select('name description price category image stock createdAt')
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' })

    return res.status(200).json({ success: true, product })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Unable to load product.' })
  }
}
