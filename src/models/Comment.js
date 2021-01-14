import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    creatorId: { // User's _id
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    creator: { 
        type: String
    },
    creatorAvatarUrl: {
        type: String
    },
    text: {
        type: String,
        required: "Text is required"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const model = mongoose.model("Comment", CommentSchema);
export default model;