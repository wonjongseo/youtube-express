import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const PORT = 4000;
const app = express();
app.use(morgan("dev"));

app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/viedos", videoRouter);

const handleListening = () =>
    console.log(`Server listening on http://localhost:${PORT}`);

app.listen(PORT, handleListening);
