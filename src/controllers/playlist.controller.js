import mongoose, { isValidObjectId, sanitizeFilter } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {

    if (!req.user) {
        throw new ApiError(401, "Unauthorized: Please log in to create a playlist");
    }

    const { name, description } = req.body

    if (!name?.trim()) {
        throw new ApiError(400, "Name is required for playlist")
    }

    const existedPlaylist = await Playlist.findOne({
        name,
        user: req.user?._id
    })

    if (existedPlaylist) {
        throw new ApiError(409, "Playlist already exists")
    }

    const createdPlaylist = await Playlist.create({
        name: name.trim(),
        description: description || "",
        videos: [],
        user: req.user?._id
    })

    if (!createdPlaylist) {
        throw new ApiError(500, "Something went wrong while creating playlist")
    }

    return res
        .status(201)
        .json(
            new ApiResponse(201, createdPlaylist, "Playlist created successfully")
        )
})


const getUserPlaylists = asyncHandler(async (req, res) => {

    if (!req.user) {
        throw new ApiError(401, "Unauthorized: Please log in to see your playlist")
    }

    const { userId } = req.params

    if (!userId) {
        throw new ApiError(400, "User id is missing")
    }

    const userPlaylist = await Playlist.find(
        { user: userId },
        { name: 1, description: 1, videos: 1 }
    )

    if (!userPlaylist) {
        throw new ApiError(404, "Playlist does not exists")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, userPlaylist, "User playlists fetched successfully")
        )

})


const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    if (!playlistId) {
        throw new ApiError(404, "Playlist id is invalid")
    }

    const playlistById = await Playlist.findById(
        { _id: playlistId },
        { name: 1, description: 1, videos: 1 }
    )

    if (!playlistById) {
        throw new ApiError(404, "Playlist does not exists")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, playlistById, "Playlist fetched successfully")
        )
})


const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if (!playlistId || !videoId) {
        throw new ApiError(400, "Both fields are required")
    }

    const addVideo = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $addToSet: {
                videos: videoId
            },
        },
        { new: true }
    )

    // if (addVideo.videos.includes(videoId)) {
    //     throw new ApiError(400, "Video exists in playlist")
    // }

    if (!addVideo) {
        throw new ApiError(400, "failed operation")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, addVideo, "Video added in playlist")
        )
})


const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if (!playlistId || !videoId) {
        throw new ApiError(400, "Both fields are required")
    }

    const removeVideo = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull: {
                videos: videoId
            },
        },
        { new: true }
    )

    if (!removeVideo) {
        throw new ApiError(400, "failed operation")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, removeVideo, "Video removed from playlist")
        )
})


const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    // TODO: delete playlist

    const deletedPlaylist = await Playlist.findByIdAndDelete(
        playlistId
    )

    if (!deletePlaylist) {
        throw new ApiError(400, "Something went wrong")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, deletedPlaylist, "Playlist Deleted successfully")
        )
})


const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;
    console.log(playlistId,name,description)

    if (!playlistId || !isValidObjectId(playlistId)) {
        throw new ApiError(404, "Invalid playlist id");
    }

    if (!name || !description) {
        throw new ApiError(400, "All fields are required")
    }

    // const updateFilelds = {};
    // if (name) updateFilelds.name = name
    // if (description) updateFilelds.description = description

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: {
                name,
                description
            }
        },
        { new: true }
    )

    if (!updatedPlaylist) {
        throw new ApiError(400, "Error while updating playlist")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedPlaylist, "Playlist updated successfully")
        )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}