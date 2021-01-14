// import { videos } from "../db";
import routes from "../routes"; // don't need { }, since route has been 'export default'
import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";
import { s3 } from "../localsMiddleware";

export const home = async (req, res) => {
    try {
        const videos = await Video.find({}).populate("creator").sort({ _id: -1 }); // -1: from bottom to top
        res.render("home", { pageTitle: "Home", videos: videos });
    } catch (error) {
        console.log(error);
        res.render("home", { pageTitle: "Home", videos: [] });
    }
};

export const search = async (req, res) => {
    // const searchingBy = req.query.term;
    const {
        query: { term: searchingBy }
    } = req;
    let videos = [];
    try {
        videos = await Video.find(
            { $or: [
                { title: { $regex: searchingBy, $options: "i" } },  // "i", insensitive
                { description: { $regex: searchingBy, $options: "i" } }
            ]}
        ).populate("creator")
        .sort({ _id: -1 }); // -1: from bottom to top
    } catch (error) {
        console.log(error)
    }
    res.render("search", { pageTitle: "Search", searchingBy, videos });
};


export const getUpload = (req, res) =>
    res.render("upload", { pageTitle: "Upload" });


export const postUpload = async (req, res) => {
    const {
        body: { title, description }
    } = req;
    // console.log(req.files);
    const videoFilePath = req.files["videoFile"][0].location;
    let thumbnailFilePath;
    if(req.files["thumbnailFile"]) {
        thumbnailFilePath = req.files["thumbnailFile"][0].location;
    }
    try {
        const newVideo = await Video.create({
            creator: req.user._id,
            fileUrl: videoFilePath,
            thumbnailUrl: thumbnailFilePath,
            title: title,
            description: description
        });
        await req.user.myVideos.push(newVideo._id);
        req.user.save();
        res.redirect(routes.videoDetail(newVideo.id));
    } catch(error) {
        res.redirect(`/videos${routes.getUpload}`);
    }
};


export const videoDetail = async (req, res) => {
    const {
        params: { id }
    } = req;
    try {
        let video = await Video.findById(id).populate("creator").populate("comments");
        // TODO: maybe populate comment's creator for comments... ???
        res.render("videoDetail", { pageTitle: video.title, video });
    } catch (error) {
        console.log(error);
        res.redirect(routes.home);
    }
};

export const getEditVideo = async (req, res) => {
    const {
        params: { id }
    } = req;
    try {
        const video = await Video.findById(id);
        if ((req.user.id).toString() === (video.creator).toString()) {
            res.render("editVideo", { pageTitle: `Edit ${video.title}`, video });
        } else {
            throw Error();
        }
    } catch (error) {
        res.redirect(routes.home);
    }
};
export const postEditVideo = async (req, res) => {
    const {
        params: { id },
        body: { title, description }
    } = req;
    try {
        await Video.findOneAndUpdate({ _id: id }, { title: title, description });
        res.redirect(routes.videoDetail(id));
    } catch (error) {
        res.redirect(routes.home);
    }
};

export const deleteVideo = async (req, res) => {
    const {
        params: { id }
    } = req;
    try {
        const video = await Video.findById(id);
        const urlVideo = video.fileUrl.split('/'); // fileUrl segments that are split by '/'
        const delFileName = urlVideo[urlVideo.length - 1]; // file name saved in s3 bucket
        let urlThumbnail;
        let delThumbnailName;
        if ((req.user.id).toString() === (video.creator).toString()) {
            // Remove from the user's myVideo list
            const user = await User.findById(req.user.id);
            const index = user.myVideos.indexOf(id); 
            user.myVideos.splice(index, 1);
            user.save();
            // Remove all comments of this video
            video.comments.forEach(async function(cId) {
                console.log(cId.toString());
                await Comment.deleteOne({_id: cId.toString()});
            });
            await Video.findOneAndRemove({ _id: id })
            // Delete the video saved in folder in /videos
            s3.deleteObject({
                Bucket: "vidulgi/videos",
                Key: delFileName
            }, function(err, data) {
                if (err) 
                    console.log("Failed to delete video in s3: " + err);
            });
            // Delete thumbnail of that video, if there is in /avatars
            if (video.thumbnailUrl) {
                urlThumbnail = video.thumbnailUrl.split('/');
                delThumbnailName = urlThumbnail[urlThumbnail.length - 1];
                s3.deleteObject({
                    Bucket: "vidulgi/videos",
                    Key: delThumbnailName
                }, function(err, data) {
                    if (err) 
                        console.log("Failed to delete thumbnail in s3" + err);
                });
            }
        } else {
            throw Error();
        }            
    } catch (error) {
        console.log(error);
    }
    res.redirect(routes.home);
};


export const postUpdateViews = async(req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        video.views ++;
        video.save();
        res.status(200);
    } catch (error) {
        console.log(error);
        res.status(400);
    } finally {
        res.end(); // <-- is it truelly Required ???
    }
}

export const postRegisterComment = async(req, res) => {
    const videoId = req.params.id;
    const text = req.body.comment;
    try {
        const video = await Video.findById(videoId);
        const newComment = await Comment.create({
            creatorId: req.user._id,
            creator: req.user.name,
            creatorAvatarUrl: req.user.avatarUrl,
            text: text,
        });
        await video.comments.push(newComment._id);
        video.save();
        res.send(newComment._id); // put newComment._id in res
        // res.status(200);
    } catch(err) {
        console.log(err);
        res.status(400);
    } finally {
        res.end();
    }
    
}

export const deleteComment = async(req, res) => {
    const videoId = req.params.videoId;
    const commentId = req.params.commentId;
    try {
        const video = await Video.findById(videoId);
        const index = video.comments.indexOf(commentId); 
        video.comments.splice(index, 1);
        video.save();
        await Comment.deleteOne({_id: commentId});
        res.status(200);
    } catch(err) {
        console.log(err);
        res.status(400);
    } finally {
        res.end();
    }
}

// don't forget to export them, in order to use in globalRouter.js