import express from 'express'
import { getUser, loginUser, logoutUser, signup } from '../controller/auth.controller.js'
import { verifyUser } from '../middleware/verifyUser.js'
import { getSuggestedUser } from '../controller/user.controller.js'


const router = express.Router()

router.post("/signup", signup)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.get('/me', verifyUser, getUser)
router.get('/suggested', verifyUser, getSuggestedUser)


export default router