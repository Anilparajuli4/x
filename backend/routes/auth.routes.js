import express from 'express'
import { getUser, loginUser, logoutUser, signup } from '../controller/auth.controller.js'
import { verifyUser } from '../middleware/verifyUser.js'


const router = express.Router()

router.post("/signup", signup)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.get('/me', verifyUser, getUser)


export default router