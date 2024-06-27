import express from 'express'
import { verifyUser } from '../middleware/verifyUser.js'
import { commentPost, createPost, deletePost, getAllPost, getFollowingUser, getLikedPost, getUserPost, likOrUnlikePost } from '../controller/post.controller.js'

const router = express.Router()

router.post('/create', verifyUser, createPost)
router.delete('/delete/:id', verifyUser, deletePost)
router.post ('/comment/:id', verifyUser, commentPost)
router.post('/like/:id', verifyUser, likOrUnlikePost)
router.get('/likes/:id', verifyUser, getLikedPost)
router.get('/all', getAllPost)
router.get('/following', verifyUser, getFollowingUser)
router.get('/userpost/:username', verifyUser, getUserPost)
export default router