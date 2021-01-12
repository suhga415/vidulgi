import express from "express";
import routes from "../routes";
import { 
    users, 
    userDetail, 
    getEditProfile, 
    getChangePassword, 
    postEditProfile, 
    postChangePassword 
} from "../controllers/userController";
import { uploadAvatar, onlyPrivate } from "../localsMiddleware";

const userRouter = express.Router();

// userRouter.get(routes.users, users);
userRouter.get(routes.editProfile, onlyPrivate, getEditProfile);
userRouter.get(routes.changePassword, onlyPrivate, getChangePassword);
userRouter.get(routes.userDetail(), userDetail);
userRouter.post(routes.editProfile, onlyPrivate, uploadAvatar, postEditProfile);
userRouter.post(routes.changePassword, onlyPrivate, postChangePassword);

export default userRouter;
