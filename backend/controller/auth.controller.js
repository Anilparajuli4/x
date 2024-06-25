import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import { ErrorHandler } from "../utils/errorHandler.js";
import { generateTokenAndSetCookie } from "../utils/genrateToken.js";

export const signup = async(req, res, next) =>{
try {
    const {fullname, username, email, password} = req.body
    console.log(fullname);
    if(!fullname || !username || !email || !password){
         return next(new ErrorHandler(400, "all fields are required")) 
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailRegex.test(email)){
        return next(new ErrorHandler(400, 'invaliad email format'))
    }

    const existingUser = await User.findOne({username})
    if(existingUser){
        return next(new ErrorHandler(400, 'username already exsit'))  
    }

    const existingEmail = await User.findOne({email})

    if(existingEmail){
        return next(new ErrorHandler(400, "email already exsit"))  
    }

    if(password.length < 6){
        return next(new ErrorHandler(400, 'password must be at least 6 character long'))
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

   const newUser = new User({
    fullname,
    username,
    email,
    password:hashedPassword
   })
   const{password:valiadPassword , ...rest} = newUser._doc

   if(newUser){
    generateTokenAndSetCookie(newUser._id, res)
    await newUser.save()
    return res.status(200).json({
        success:true,
        data:rest,
        message:'register successfully'
    })
   }

} catch (error) {
    next(error)
}
}

export const loginUser= async(req, res, next) =>{
    try {
        const {email, password} = req.body
        if(!email || !password){
            return next(new ErrorHandler(400, 'all fields are required'))
        }
    
        const user = await User.findOne({email})
        if(!user){
            return next(new ErrorHandler(400, 'user doesnot exist'))
        }
    
        const valiadPassword = bcrypt.compareSync(password, user?.password || "")
        if(!valiadPassword){
            return next(new ErrorHandler(400, 'invaliad credentials'))
        }
        generateTokenAndSetCookie(user?._id, res)
        const {password:hashPassword, ...rest} = user._doc
        return res.status(200).json({
           success:true,
           data: rest,
            message: 'login successfully'
        })
    } catch (error) {
        next(error)
    }
   
}


export const logoutUser = async(req, res, next) =>{
   try {
    res.cookie("jwttoken", "", {httpOnly:true,
        maxAge:0
    })
    return res.status(200),json({
        success:true,
        messag:'logout successfully'
    })
   } catch (error) {
    next(error)
   }
    
}


export const getUser = async(req, res)=>{
    try {
        const user = await User.findById(req.user?._id)
        if(!user){
            return next(new ErrorHandler(400, 'invaliad user'))
        }
        const {password, ...rest} = user._doc
        return res.status(200).json({
            success:true,
            data: rest,
            message: 'user data fetched successfully'
        })
    } catch (error) {
        next(error)
    }
}