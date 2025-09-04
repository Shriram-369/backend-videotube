import express from "express"
import cors from "cors"
import coockieParser from "cookie-parser"


const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))
app.use(coockieParser())

//routes import
import userRouter from "./routes/user.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import videoRouter from "./routes/video.routes.js"

//routes declaration
app.use("/api/v1/users",userRouter)   //https://localhost:8000/api/v1/users/register
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/video", videoRouter)

export { app }