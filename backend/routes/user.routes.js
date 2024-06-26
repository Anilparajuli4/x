import express from 'express'
import { followUnfollowUser, getSuggestedUser, getUserProfile } from '../controller/user.controller.js'
import { verifyUser } from '../middleware/verifyUser.js'


const router = express.Router()
router.get('/profile/:username', verifyUser,  getUserProfile)
router.post('/follow/:id', verifyUser,   followUnfollowUser)
router.get('/suggested', verifyUser, getSuggestedUser)


export default router

