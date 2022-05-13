import "./db";
import "./models/Video";
import "./models/User";
import app from "./server.js";

const PORT = 4014;

const handleListening = () =>
    console.log(`✅ Server listening on http://localhost:${PORT}`);

app.listen(PORT, handleListening);
