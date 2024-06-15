import express from 'express'
import authRoutes from './routes/auth.routes.js'
import dotenv from 'dotenv'
import connectMongoDB from './db/connectMongoDB.js'

const app = express()
dotenv.config()

connectMongoDB()
app.use('api/auth', authRoutes)

app.listen(process.env.PORT || 500, ()=>{
    console.log('server is running');
})