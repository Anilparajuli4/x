import jwt from 'jsonwebtoken'
import { ErrorHandler } from '../utils/errorHandler.js'
import User from '../models/user.model.js'
export const verifyUser = async(req, res, next) =>{
 try {
    const token = req.cookies?.jwttoken 
    if(!token){
        return next(new ErrorHandler( 400, 'unathorized no token provided'))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if(!decoded){
        return next(new ErrorHandler(400, 'Invalid token'))
    }
    const user = await User.findById(decoded?.userid).select("-password")
    if(!user){
        return next(new ErrorHandler('user not found from token id'))
    }
    
    req.user = user
    next()
 } catch (error) {
     next(new ErrorHandler(500, `error while verifying user ${error.message}`))
 }
}