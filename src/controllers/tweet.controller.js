import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Playlist } from "../models/playlist.model.js"

const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body

    if (!content?.trim()) {
        throw new ApiError(400, "Content required for tweet")
    }

    const create = await Tweet.create({
        content: content,
        owner: req.user._id
    })
    console.log(create)

    if (!create) {
        throw new ApiError(500, "Error while creating tweet")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, create, "Tweet created successfully")
        )
})

const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params
    console.log(userId)
    if (!userId) {
        throw new ApiError(400, "UserId is required")
    }

    const userTweets = await Tweet.find(
        { owner: userId },
        { content: 1, createdAt: 1 }
    )

    if (!userTweets) {
        throw new ApiError(404, "Tweets not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, userTweets, "Tweets fetched successfully")
        )
})

const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    const { content } = req.body

    if (!content?.trim()) {
        throw new ApiError(400, "Content is required to update")
    }

    if (!tweetId) {
        throw new ApiError(400, "Tweet id is required")
    }

    const updatingTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        { $set: { content } },
        { new: true }
    )

    if (!updatingTweet) {
        throw new ApiError(500, "Something went wrong while updating tweet")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatingTweet, "Tweet updated successfully")
        )
})

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params

    const deletingTweet = await Tweet.findByIdAndDelete(
        tweetId
    )

    if (!deletingTweet) {
        throw new ApiError(500 ,"Something went wrong while deleting tweet")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, deletingTweet,"Tweet deleted successfully")
    )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}