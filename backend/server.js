import express from 'express'
import authRoutes from './routes/auth.routes.js'
import dotenv from 'dotenv'
import connectMongoDB from './db/connectMongoDB.js'
import { globalErrorHandler } from './middleware/globalErrorHandler.js'

const app = express()
dotenv.config()
app.use(express.json({limit:'5mb'}))
connectMongoDB()
app.use(express.urlencoded({extended:true}))
app.use("/api/auth", authRoutes)
 //to parse form data

app.use(globalErrorHandler)

app.listen(process.env.PORT || 3000, ()=>{
    console.log('server is running');
})