import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/youtube");

mongoose.connection.on("error", (error) => console.log("❌ DB Error", error));
mongoose.connection.once("open", () => console.log("✅ Connected to DB"));
