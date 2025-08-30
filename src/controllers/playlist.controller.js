import mongoose, { isValidObjectId } from "mongoose"
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
        {user: userId},
        {name: 1, description: 1, videos: 1}
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
        {_id: playlistId},
        {name: 1, description: 1, videos: 1}
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
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    // TODO: remove video from playlist

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    // TODO: delete playlist
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body
    //TODO: update playlist
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