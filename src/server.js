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
        secret: process.env.COOKIE_SECRET,
        // 로그인한 유저에게만 세션아이디를 부여하고 데이터베이스에도 저장시킴 ( 세션이 수정됬을떄만)
        resave: false,
        saveUninitialized: false,
        //sessioin cookie == 브라우저 프로레스를 닫으면 지원짐
        cookie: {
            maxAge: 1000 * 60 * 60,
        },
        store: MongoStore.create({
            mongoUrl: process.env.DB_URL,
        }),
    })
);

app.use(localsMiddleware);
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;
