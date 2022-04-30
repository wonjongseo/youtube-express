import express from "express";

const videoRouter = express.Router();

const handleEditVideo = (req, res, next) => {
    return res.send("Edit Video");
};

videoRouter.get("/watch", handleEditVideo);

export default videoRouter;
