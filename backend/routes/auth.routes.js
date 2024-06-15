import express from 'express'
import { signup } from '../controller/auth.controller.js'


const router = express.Router()

router.post("/signup", signup)

// router.post("/signin", (req, res)=>{
//     res.send('signup')
// })


// router.post("/logout", (req, res)=>{
//     res.send('signup')
// })


export default router