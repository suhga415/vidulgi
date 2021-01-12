import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config(); // This function will automatically try to call .env file.

mongoose.connect(
    process.env.MONGO_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }
);

const db = mongoose.connection; // to be able to export later

const handleOpen = () => { console.log("🍖 Connected to DB"); };
const handleError = (error) => { console.log(`☠︎ Error on DB Connection: ${error}`) };
db.once("open", handleOpen);
db.on("error", handleError);