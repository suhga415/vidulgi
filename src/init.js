import "@babel/polyfill";
import "./db";
import app from "./app";
import dotenv from "dotenv";
import "./models/Video";
import "./models/Comment";
dotenv.config();

const PORT = process.env.PORT || 4000;

const handleListening = () =>
    console.log(`🧀 listening on: http://localhost:${PORT}!`);

app.listen(PORT, handleListening);
