import "dotenv/config";
import "./db";
import "./models/Video";
import "./models/User";
import app from "./server.js";

console.log(undefined === null); //false
console.log(undefined == null); // ture

const PORT = 4000;

const handleListening = () =>
    console.log(`✅ Server listening on http://localhost:${PORT}`);

app.listen(PORT, handleListening);
