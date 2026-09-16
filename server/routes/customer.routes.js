import express from 'express'
import { registercustomer, logincustomer, viewSelf, logoutCustomer } from '../controllers/customer.controllers.js'
import { isAuthenticated } from '../middlewares/auth.middleware.js'

const customerRoutes = express.Router()

customerRoutes.post('/register', registercustomer)
customerRoutes.post('/login', logincustomer)
customerRoutes.get('/me', isAuthenticated, viewSelf)
customerRoutes.post('/logout', logoutCustomer)


export default customerRoutes