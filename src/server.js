import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import {localsMiddleware} from "./middlewares";

const app = express();
app.use(morgan("dev"));
// form 으로부터 받은 데이터를 javascript object 형태로 바꿔줌.
app.use(express.urlencoded({extended: true}));
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(
    session({
        secret: "Hello!",
        resave: true,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: "mongodb://127.0.0.1:27017/youtube",
        }),
    })
);

app.use(localsMiddleware);
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;
