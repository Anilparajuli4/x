import Notification from "../models/notification.model.js"
import { ErrorHandler } from "../utils/errorHandler.js"

export const getNotification = async (req, res, next) =>{
    try {
        const userId = req.user._id
        const notification = await Notification.find({to:userId}).populate({
            path:'from',
            select: '-username -profileImg'
        })
        await Notification.updateMany({to:userId}, {read:true})
        return res.status(200).json({
            success:true,
            message:'notification read '
        })
    } catch (error) {
        next(new ErrorHandler(500, error.message))
    }
}

export const deleteNotification = async(req, res, next)=>{
    try {
        const userid = req.user._id
        await Notification.deleteMany({to:userid})
        return res.status(200).json({
            success:true,
            message: 'notification deleted successfully'
        })
    } catch (error) {
        next(new ErrorHandler(500, error.message))
    }
}