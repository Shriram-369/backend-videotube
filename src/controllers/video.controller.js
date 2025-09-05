import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"



const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body

    if (!req.user) {
        throw new ApiError(401, "Unauthorized: Please log in to create a playlist");
    }

    const videoFileLocalPath = req.files.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files.thumbnail?.[0]?.path;

    if (!videoFileLocalPath && !thumbnailLocalPath) {
        throw new ApiError(400, "Video file or Thumbnail missing")
    }

    const videoFile = await uploadOnCloudinary(videoFileLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if (!videoFile && !thumbnail) {
        throw new ApiError(400, "Video file or Thumbnail missing")
    }

    const createdVideo = await Video.create({
        title,
        description,
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        owner: req.user?._id,
        duration: 5
    })
    console.log(createdVideo)

    if (!createdVideo) {
        throw new ApiError(500, "Somthing went wrong while publishing video")
    }

    return res
        .status(201)
        .json(
            new ApiResponse(201, createdVideo, "Video published successfully")
        )
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!videoId) {
        throw new ApiError(400, "videoId is missing")
    }

    const video = await Video.findById(
        { _id: videoId },
        {
            videoFile: 1,
            thumbnail: 1,
            description: 1,
            duration: 1,
            views: 1,
            isPublished: 1,
            owner: 1
        }
    )

    if (!video) {
        throw new ApiError(404, "Video does not exists")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, video, "Video fetched successfully")
        )
})

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { title, description } = req.body
    const thumbnailLocalPath = req.file.path
    
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    if (!title || !description || !thumbnailLocalPath) {
        throw new ApiError(400, "All  fields required")
    }

    const updateFields = {};
    if (title) updateFields.title = title
    if (description) updateFields.description = description
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    if (thumbnail) updateFields.thumbnail = thumbnail.url

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        { $set: updateFields },
        { new: true }
    )

    if (!updateVideo) {
        throw new ApiError(404, "Video not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedVideo, "Video updated successfully")
        )
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})


export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}