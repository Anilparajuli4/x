import Notification from "../models/notification.model.js"
import User from "../models/user.model.js"
import { ErrorHandler } from "../utils/errorHandler.js"
import bcrypt from 'bcryptjs'
import {v2 as cloudinary} from 'cloudinary'

export const getUserProfile = async(req, res, next) =>{
const {username} = req.params
if(!username){
    return next(new ErrorHandler(400, 'no username'))
}
try {
    const user = await User.findOne({username}).select("-password")
    if(!user){
        return next(new ErrorHandler(400, 'user does not found'))
    }
return res.starus(200).json({
    success:true,
    data:user,
    message:'get user profile successfully'
})
} catch (error) {
    next(error)
}

}

export const followUnfollowUser = async(req, res, next) =>{
    try {
        const {id} = req.params
        const userModify = await User.findById(id)
        const currentUser = await User.findById(req.user?._id)
        if(!userModify || !currentUser){
            return next(new ErrorHandler(400, 'user not found'))
        }
        if(id === req.user?.id.toString()){
            return next(new ErrorHandler(400, 'you cannot follow yoursef'))
        }
        const isFollowing = currentUser.following.includes(id)
        if(isFollowing){
           await User.findByIdAndUpdate(id, {$pull: {followers: req.user._id}})
           await User.findByIdAndUpdate(req.user?._id, {$pull: {following: id}})
           return res.status(200).json({
            success:true,
            message:'unfollow successfully'
           })
        }else{
           await User.findByIdAndUpdate(id, {$push: {followers: req.user._id}})
           await User.findByIdAndUpdate(req.user?._id, {$push:{following: id}})
           const newNotification = new Notification({
            type: "follow",
            from: req.user._id,
            to: userModify._id
           })
           await newNotification.save()
           return res.status(200).json({
            success:true,
            message:'follow successfully'
           })
        }
    } catch (error) {
        
        next(error.message)
    }
}


export const getSuggestedUser = async(req, res, next) =>{
    try {
        const userid = req.user._id
        const userFollowed = await User.findById(userid).select("-following")
        const users = await User.aggregate([
            {
                $match:{
                    _id:{$ne:userid}
                }
            },
            {
                $sample:{size:10}
            }
        ])

        const filterUser = users.filter(user=> !userFollowed.following?.include(user._id))
        const suggestedUser = filterUser.slice(0, 4)
        suggestedUser.forEach(user => user.password =null)
        res.status(200).json({
            success:true,
            data:suggestedUser,
            message:'successfully fetched suggested user'
        })
    } catch (error) {
        next(new ErrorHandler(500, `error in getSuggestedUser: ${error.message}`))
    }
} 

export const updateUserProfile = async(req, res, next) =>{
    const {fullname, email, username, currentPassword, newPassword, bio, link} = req.body
    let { profileImg, coverImg } = req.body
    const userid = req.user._id

    try {
        let user = await User.findById(userid)
        if(!user){
            return next(new ErrorHandler(400, 'user not found'))
        }

        if(!currentPassword || !newPassword){
            return next(new ErrorHandler(400, 'please provide both currentPassword and newPassword'))
        }
        if(currentPassword && newPassword){
            const isMatch = await bcrypt.compare(currentPassword, user.password)
            if(!isMatch){
                return next(new ErrorHandler(400, 'current password is incorrect'))
            }
            if(newPassword.length < 6){
                return next(new ErrorHandler(400, 'password must be at least 6 character'))
            }
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(newPassword, salt)
        }

        if (profileImg) {
			if (user.profileImg) {
				// https://res.cloudinary.com/dyfqon1v6/image/upload/v1712997552/zmxorcxexpdbh8r0bkjb.png
				await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(profileImg);
			profileImg = uploadedResponse.secure_url;
		}

		if (coverImg) {
			if (user.coverImg) {
				await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(coverImg);
			coverImg = uploadedResponse.secure_url;
		}

		user.fullname = fullname || user.fullname;
		user.email = email || user.email;
		user.username = username || user.username;
		user.bio = bio || user.bio;
		user.link = link || user.link;
		user.profileImg = profileImg || user.profileImg;
		user.coverImg = coverImg || user.coverImg;

		user = await user.save();

		// password should be null in response
		user.password = null;

		return res.status(200).json({
            success:true,
            data:user
        });
           
       

        
    } catch (error) {
        
    }
}