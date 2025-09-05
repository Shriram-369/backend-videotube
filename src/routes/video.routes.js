import { Router } from "express";

import {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
} from "../controllers/video.controller.js"

import { upload } from "../middlewares/multer.middlewares.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/publish-video").post(
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    verifyJWT, publishAVideo
)

router.route("/:videoId")
    .get(verifyJWT, getVideoById)
    .patch(upload.single("thumbnail"), updateVideo)







export default router;