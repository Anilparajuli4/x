import Notification from "../models/notification.model.js"
import Post from "../models/post.model.js"
import User from "../models/user.model.js"
import { ErrorHandler } from "../utils/errorHandler.js"
import {v2 as cloudinary}  from "cloudinary"

export const createPost = async(req, res, next)=>{
    try {
        const {text} = req.body
        const {img} = req.body
        const userId = req.user._id
        const user = await User.findById(userId)
        if(!user){
            return next(new ErrorHandler(400, 'user not founnd'))
        }

        if(!text && !img){
            return next(new ErrorHandler(400, 'post must have text or image'))
        }

        if(img){
            const uploadResult = await cloudinary.uploader.upload(img)
            img = uploadResult?.secure_url
        }

        const newPost = new Post({
            user:userId,
            text,
            img
        })
        await newPost.save()
        res.status(200).json({
            success:true,
            data:newPost,
            message: 'post created successfully'
        })
    } catch (error) {
        next(new ErrorHandler(400, `error while creating post: ${error.message}`))
    }
}

export const deletePost = async(req, res, next) =>{
    try {
        const {id} = req.params
        const user = await User.findById(req.user?._id)
        if(!user){
            return next(new ErrorHandler(400, 'user not found'))
        }
        const post = await Post.findById(id)
        if(!post){
            return next(new ErrorHandler(400, 'post not found'))
        }
        // console.log(post.user);
        // console.log(user._id);
        if(post.user.toString() !== user._id.toString()){
            return next(new ErrorHandler(400, 'not allowed to delete post'))
        }
        if(post.img){
            const imgId  = post.img.split("/").pop().split(".")[0]
           await cloudinary.uploader.destroy(imgId)
        }
        await Post.findByIdAndDelete(id)
        return res.status(200).status({
            success:true,
            message:'successfully deleted post'
        })
    } catch (error) {
        console.log(error);
        next(new ErrorHandler(400, `error while deleting the post: ${error.message}`))
    }
   
}

export const commentPost = async(req, res, next)=>{
   try {
    const {id}= req.params
    const {text} = req.body
    if(!text){
        return next(new ErrorHandler(400, 'text is required'))
    }
    const user = await User.findById(req.user._id)
    const post = await Post.findById(id)
    if(!user){
        return next(new ErrorHandler(400, 'no user found'))
    }
    if(!post){
        return next(new ErrorHandler(400, 'no post found'))

    }

    const comment = {user:req.user._id, text}
  
    post.comments.push(comment)
    await post.save()
    res.status(200).json({
        success:true,
        data:post,
        message:'comment successfuly'
    })
   } catch (error) {
    console.log(error);
    next(new ErrorHandler(500, `error while creating comment: ${error.message}`))
   }

}

export const likOrUnlikePost = async(req, res, next)=>{
    try {
        const {id} = req.params
    const userid= req.user._id
    const post = await Post.findById(id)
    const user = await User.findById(userid)
    if(!post){
        return next(new ErrorHandler(400, 'post not found'))
    }

    if(!user){
        return next(new ErrorHandler(400, 'user not found'))
    }

    const isLike = post.likes.includes(userid)
    if(isLike){
        await Post.findByIdAndUpdate(id, {$pull: {likes:userid}})
        await User.findByIdAndUpdate(userid, {$pull: {likedPost:id}})
        res.status(200).json({
            success:true,
            message:'successfully dislike the post'
        })
    }else{
        await Post.findByIdAndUpdate(id, {$push: {likes:userid}})
        await User.findByIdAndUpdate(userid, {$push: {likedPost:id}})
        const newNotification = new Notification({
            from:userid,
            to: post.id,
            type: 'like'
        })
        await newNotification.save()
        res.status(200).json({
            success:true,
            message:'successfully like the post'
        })
    }
    } catch (error) {
        next(new ErrorHandler(500, `error while like or unlike the post ${error.message}`))
    }
    
}

export const getAllPost = async(req, res, next) =>{
   try {
    const post = await Post.find().sort({createdAt: -1}).populate({path:'user',
        select:'-password'
    }).populate({path:'comments.user',
        select:'-password'
    })
    res.status(200).json({
        success:true,
        data:post,
        message:'successfully fetched all the post'
    })
   } catch (error) {
    next(new ErrorHandler(500, `error while geting all the post: ${error.message}`))
   }
}

export const getLikedPost = async(req,res,next)=>{
   const userId = req.params.id

   try {
    const user = await User.findById(userId)
    if(!user){
        return next(new ErrorHandler(400, 'user not found'))
    }

    console.log(user.likedPost);
    const likedPost = await Post.find({_id: {$in: user.likedPost}}).populate({path:'user', select:'-password'}).populate({
        path: "comments.user",
        select: "-password"
    })

    res.status(200).json({
        success:true,
        data:likedPost,
        message:'successfully fetched liked post'
    })

   } catch (error) {
    next(new ErrorHandler(400,  `error while geting liked the post: ${error.message}`))
   }
}


export const getFollowingUser = async(req, res, next) =>{
    try {
        const user = await User.findById(req.user._id)
        if(!user){
            return next(new ErrorHandler(400, 'user not found'))
        }
        const followingPost = await Post.find({user: {$in: user.following}}).sort({createdAt: -1}).populate({
            path:'user',
            select: '-password'
        }).populate({
            path:'comments.user',
            select: '-password'
        })
        console.log(followingPost);
        return res.status(200).json({
            success:true,
            data:followingPost,
            message: 'fetched the following post'
        })
        
    } catch (error) {
        next(new ErrorHandler(500, `error while gettingFollowingPost: ${error.message}`))
    }
   
}


export const getUserPost = async(req, res, next) =>{
    const {username} = req.params
    const user = await User.findOne({username})
    if(!user){
        return next(new ErrorHandler(400, 'user not found'))
    }

   const userPost = await Post.find({user:user._id}).sort({createdAt: -1}).populate({
     path:'user',
     select:'-password'
   })
   return res.status(200).json({
    success:false,
    data:userPost,
    message:'successfully fetched user post'
   })
}
