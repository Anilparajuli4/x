import express from 'express'
import { verifyUser } from '../middleware/verifyUser.js'
import { createPost, deletePost } from '../controller/post.controller.js'

const router = express.Router()

router.post('/create', verifyUser, createPost)
router.delete('/delete/:id', verifyUser, deletePost)

export default router