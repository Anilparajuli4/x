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