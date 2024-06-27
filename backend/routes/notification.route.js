import express from 'express'
import { verifyUser } from '../middleware/verifyUser.js'
import { deleteNotification, getNotification } from '../controller/notification.controller.js'

const router = express.Router()

router.get('/', verifyUser, getNotification)
router.delete('/delete', verifyUser, deleteNotification)
export default router