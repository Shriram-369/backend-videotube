import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

})


const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { videoId } = req.params
    const { content } = req.body

    if (!req.user._id) {
        throw new ApiError(400,"Log in to add comments")
    }
    
    if (!content) {
        throw new ApiError(400, "Comment content is required")
    }

    const createComment = await Comment.create({
        content: content,
        owner: req.user._id,
        video: videoId
    })

    if (!createComment) {
        throw new ApiError(500, "Failed to create comment")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, createComment, "Comment created successfully")
    )
})


const updateComment = asyncHandler(async (req, res) => {
    
    const { commentId } = req.params
    const { content } = req.body   

    if (!content) {
        throw new ApiError(400, "Add content to update comment")
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        { _id: commentId, user: req.user._id },
        {
         content   
        },
        { new: true }
    )

    if (!updatedComment) {
        throw new ApiError(500, "Updation failed")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedComment, "Comment updated successfully")
    )
})


const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
})


export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
}