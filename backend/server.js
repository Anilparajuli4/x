import express from 'express'
import authRoutes from './routes/auth.routes.js'
import postRoutes from './routes/post.route.js'
import dotenv from 'dotenv'
import connectMongoDB from './db/connectMongoDB.js'
import { globalErrorHandler } from './middleware/globalErrorHandler.js'
import userRoutes from './routes/user.routes.js'
import cookieParser from 'cookie-parser'
import {v2 as cloudinary} from 'cloudinary'

const app = express()
dotenv.config()
app.use(express.json({limit:'5mb'}))
connectMongoDB()
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)


cloudinary.config({ 
    // cloud_name: process.env.CLOUDANIRY_CLOUD_NAME, 
    // api_key: process.env.CLOUDANIRY_API_KEY, 
    // api_secret: process.env.CLOUDANIRY_API_SECR // Click 'View Credentials' below to copy your API secret
    cloud_name: 'dhnth3m4m', 
    api_key: '944414733482528', 
    api_secret: 'Bect4iYXYL-p5R_uwF5tOOpISh8'
});

 //to parse form data

app.use(globalErrorHandler)

app.listen(process.env.PORT || 3000, ()=>{
    console.log('server is running');
})