import express from "express";
import {
    edit,
    remove,
    logout,
    see,
    deleteAllUser,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.get("/edit", edit);
userRouter.get("/remove", remove);
userRouter.get(":id", see);
userRouter.get("/deleteAll", deleteAllUser);

export default userRouter;
