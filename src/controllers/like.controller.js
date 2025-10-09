import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const userId = req.user?._id

    if (!videoId?.trim() || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Video ID is required")
    }

    const alreadyLiked = await Like.findOne(
        { video: videoId, likedBy: userId }
    )

    if (alreadyLiked) {
        await Like.findOneAndDelete(
            { video: videoId, likedBy: userId }
        )
        return res
            .status(200)
            .json(
                new ApiResponse(200, {}, "Like Removed successfully")
            )
    }

    const newLike = await Like.create({
        video: videoId, likedBy: userId
    })

    return res
        .status(200)
        .json(
            new ApiResponse(200, newLike, "Like added successfully")
        )

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const userId = req.user?._id

    if (!commentId?.trim() || !isValidObjectId(commentId)) {
        throw new ApiError(400, "Comment ID is required")
    }

    const alreadyLiked = await Like.findOne(
        { comment: commentId, likedBy: userId }
    )

    if (alreadyLiked) {
        await Like.findOneAndDelete(
            { comment: commentId, likedBy: userId }
        )
        return res
            .status(200)
            .json(
                new ApiResponse(200, {}, "Like Removed successfully")
            )
    }

    const newLike = await Like.create({
        comment: commentId, likedBy: userId
    })

    return res
        .status(200)
        .json(
            new ApiResponse(200, newLike, "Like added successfully")
        )

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    const userId = req.user?._id

    if (!tweetId?.trim() || !isValidObjectId(tweetId)) {
        throw new ApiError(400, "tweet ID is required")
    }

    const alreadyLiked = await Like.findOne(
        { tweet: tweetId, likedBy: userId }
    )

    if (alreadyLiked) {
        await Like.findOneAndDelete(
            { tweet: tweetId, likedBy: userId }
        )
        return res
            .status(200)
            .json(
                new ApiResponse(200, {}, "Like Removed successfully")
            )
    }

    const newLike = await Like.create({
        tweet: tweetId, likedBy: userId
    })

    return res
        .status(200)
        .json(
            new ApiResponse(200, newLike, "Like added successfully")
        )

}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}