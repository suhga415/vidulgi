import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
    creator: { // User's _id
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    fileUrl: {
        type: String,
        required: "File URL is required"
    },
    thumbnailUrl: {
        type: String
    },
    title: {
        type: String,
        required: "Title is required"
    },
    description: String,
    views: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    comments: [{ // should be an array of comments' ids
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

const Video = mongoose.model("Video", VideoSchema);
export default Video;
