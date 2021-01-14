import multer from "multer";
import multerS3 from "multer-s3";
import routes from "./routes";
import aws from "aws-sdk";

export const s3 = new aws.S3({
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env. AWS_SECRET_KEY,
    region: "ap-northeast-2"
});

const multerVideo = multer({
    storage: multerS3({
        s3: s3,
        acl: "public-read",
        bucket: "vidulgi/videos"
    })
});
// const multerThumbnail = multer({ dest: "uploads/thumbnails/" });
const multerAvatar = multer({ 
    storage: multerS3({
        s3: s3,
        acl: "public-read",
        bucket: "vidulgi/avatars" 
    })
});


export const uploadVideo = multerVideo.fields([
    { name: 'videoFile', maxCount: 1 }, 
    { name: 'thumbnailFile', maxCount: 1 }
]);
export const uploadAvatar = multerAvatar.single("avatarUrl");
// export const uploadThumbnail = multerThumbnail.single("thumbnailFile");


export const localsMiddleware = (req, res, next) => {
    res.locals.siteName = "Vidulgi";
    res.locals.routes = routes;
    res.locals.loggedUser = (req.isAuthenticated) ? req.user : null;
    res.locals.moment = require('moment');
    next(); // Don't forget this!!!
};

export const onlyPublic = (req, res, next) => {
    if (req.user) {
        res.redirect(routes.home);
    } else {
        next();
    }
}

export const onlyPrivate = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.redirect(routes.home);
    }
}
