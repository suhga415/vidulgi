import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    avatarUrl: String,
    facebookId: Number,
    githubId: String,
    googleId: String,
    myVideos: [{ // should be an array of videos' ids
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    }]
});

UserSchema.plugin(passportLocalMongoose, { usernameField: "email" });

const User = mongoose.model("User", UserSchema);

export default User;