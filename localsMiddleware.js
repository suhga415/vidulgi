import multer from "multer";
import routes from "./routes";

const multerVideo = multer({ dest: "uploads/videos/" });
// const multerThumbnail = multer({ dest: "uploads/thumbnails/" });
const multerAvatar = multer({ dest: "uploads/avatars/" });

export const localsMiddleware = (req, res, next) => {
    res.locals.siteName = "Vidulgi";
    res.locals.routes = routes;
    res.locals.loggedUser = (req.isAuthenticated) ? req.user : null;
    res.locals.moment = require('moment');
    // console.log(req.user);
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

export const uploadVideo = multerVideo.fields([
    { name: 'videoFile', maxCount: 1 }, 
    { name: 'thumbnailFile', maxCount: 1 }
]);
export const uploadAvatar = multerAvatar.single("avatarUrl");
// export const uploadThumbnail = multerThumbnail.single("thumbnailFile");