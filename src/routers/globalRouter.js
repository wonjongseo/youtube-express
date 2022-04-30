import express from "express";

const globalRouter = express.Router();

const handleHome = (req, res, next) => {
    return res.send("home");
};
globalRouter.get("/", handleHome);

export default globalRouter;
