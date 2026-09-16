import jwt from 'jsonwebtoken'
import Customer from '../models/customer.models.js'

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({message: "No token provided"})
        }

        const decoded = jwt.verify(token, process.env.jwt_secret)
        const customer = await Customer.findById(decoded.customerId)

        if (!customer) {
            return res.status(401).json({message: "User doesnt exist"})
        }

        req.customer = customer
        next()

    } catch (error) {
        return res.status(401).json({ message: 'Authentication failed', error: error.message })
    }
} 