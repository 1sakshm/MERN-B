import express from 'express'
import mongoose from 'mongoose'
import dotenvfrom from 'dotenv'
import customerRoutes from '../server/routes/customer.routes.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()
const port = 8001
dotenvfrom.config()
app.use(express.json())
app.use(cookieParser())
app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials : true,
    }
))


mongoose.connect(process.env.dbUri).then(() => {
    console.log("DB connected")
}).catch((err) => {
    console.log(err)
})

app.use('/customers', customerRoutes)

app.get('/', (req, res) => {
    res.send("Hello from server")
})
app.listen(port, () => {
    console.log(`Hello fom server ${port}`)
})