import express from "express";
import {
    watch,
    getEdit,
    deleteVideo,
    postEdit,
    getUpload,
    postUpload,
    deleteAll,
} from "../controllers/videoController";
import {protectorMiddleWare} from "../middlewares";

const videoRouter = express.Router();
videoRouter.get("/deleteAll", deleteAll);
videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter
    .route("/:id([0-9a-f]{24})/edit")
    .all(protectorMiddleWare)
    .get(getEdit)
    .post(postEdit);
videoRouter
    .route("/upload")
    .all(protectorMiddleWare)
    .get(getUpload)
    .post(postUpload);
videoRouter.get("/:id([0-9a-f]{24})/delete", protectorMiddleWare, deleteVideo);
export default videoRouter;
