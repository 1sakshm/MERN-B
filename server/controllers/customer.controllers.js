import mongoose from 'mongoose'
import Customer from "../models/customer.models.js"
import bcrypt from 'bcrypt'
import { genToken } from "../utils/generateToken.js"

const cookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
}

const ensureDatabaseReady = (res) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            message: "Database unavailable. Please ensure MongoDB Atlas allows your current IP address.",
        })
    }
    return null
}

export const registercustomer = async (req, res) => {
    try {
        const dbCheck = ensureDatabaseReady(res)
        if (dbCheck) return dbCheck

        const { fullname, email, password, phone } = req.body

        if (!fullname || !email || !password || !phone) {
            return res.status(400).json({ message: "All fields are required" })
        }

        if (password.length <= 6) {
            return res.status(400).json({ message: "Password should be greater than 6 characters" })
        }

        const emailExists = await Customer.findOne({ email })
        if (emailExists) {
            return res.status(409).json({ message: "Customer already exists" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newcustomer = await Customer.create({
            fullname,
            email,
            password: hashedPassword,
            phone,
        })

        const token = genToken(newcustomer._id)
        res.cookie('token', token, cookieOptions)

        res.status(201).json({ message: "Customer Registered", Customer: newcustomer })

    } catch (error) {
        res.status(500).json({ message: "Server Crashed", error: error.message })
    }
}

export const logincustomer = async (req, res) => {
    try {
        const dbCheck = ensureDatabaseReady(res)
        if (dbCheck) return dbCheck

        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' })
        }

        const customer = await Customer.findOne({ email })
        if (!customer) {
            return res.status(401).json({ message: 'Customer not found' })
        }

        const isPasswordValid = await bcrypt.compare(password, customer.password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }

        const token = genToken(customer._id)
        res.cookie('token', token, cookieOptions)

        return res.status(200).json({
            success: true,
            message: 'Login Successful',
        })
    } catch (error) {
        return res.status(500).json({ message: 'Error logging in', error: error.message }) 
    }
}


export const viewSelf = async (req, res) => {
    const authenticatedCustomer = {
        _id: req.customer._id, 
        fullname: req.customer.fullname, 
        email: req.customer.email, 
        phone: req.customer.phone
    };
    res.status(201).json({authenticatedCustomer})
}


export const logoutCustomer = async(req, res) => {
    try {
        res.clearCookie('token', cookieOptions)
        return res.status(200).json({
            success: true,
            message: 'Logged out successfully',
        })
    } catch (error) {
        return res.status(500).json({ message: 'Logout Error', error: error.message }) 
    }
}