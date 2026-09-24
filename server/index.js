import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import customerRoutes from '../server/routes/customer.routes.js'
import productRoutes from '../server/routes/product.routes.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()
const port = 8001
dotenv.config()

const mongoUri = process.env.dbUri || process.env.MONGODB_URI || process.env.MONGODB_URL

app.use(express.json())
app.use(cookieParser())
app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials : true,
    }
))

const connectToDatabase = async () => {
    if (!mongoUri) {
        console.error('MongoDB URI is missing. Add dbUri to server/.env')
        return
    }

    try {
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 15000,
        })
        console.log('DB connected')
    } catch (err) {
        console.error('MongoDB connection failed. Check Atlas IP whitelist or use a reachable database.')
        console.error(err.message)
    }
}

connectToDatabase()

app.use('/customers', customerRoutes)
app.use('/products', productRoutes)

app.get('/', (req, res) => {
    res.send("Hello from server")
})

app.listen(port, () => {
    console.log(`Hello fom server ${port}`)
})
