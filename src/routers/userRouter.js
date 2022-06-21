import express from "express";
import {
    remove,
    logout,
    see,
    deleteAllUser,
    startGithubLogin,
    finishGithubLogin,
    getEdit,
    postEdit,
    getChangePassword,
    postChangePassword,
} from "../controllers/userController";
import {protectorMiddleWare, publicOnlyMiddleWare} from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleWare, logout);
userRouter
    .route("/edit-profile")
    .all(protectorMiddleWare)
    .get(getEdit)
    .post(postEdit);
userRouter.get("/remove", remove);
userRouter.get("/github/start", publicOnlyMiddleWare, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleWare, finishGithubLogin);
userRouter.get(":id", see);
userRouter.get("/deleteAll", deleteAllUser);
userRouter
    .route("/change-password")
    .all(protectorMiddleWare)
    .get(getChangePassword)
    .post(postChangePassword);

export default userRouter;
