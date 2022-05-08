import "./db";
import "./models/Video";
import app from "./server.js";

const PORT = 4012;

const handleListening = () =>
    console.log(`✅ Server listening on http://localhost:${PORT}`);

app.listen(PORT, handleListening);
