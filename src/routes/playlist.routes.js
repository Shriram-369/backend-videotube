import { Router } from "express";
import {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById
} from "../controllers/playlist.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router.use(verifyJWT);

router.route("/create").post(createPlaylist)
router.route("/user/:userId").get(getUserPlaylists)
router.route("/:playlistId").get(getPlaylistById)



export default router