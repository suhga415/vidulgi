import express from "express";
import routes from "../routes";
import {
    postUpdateViews,
    postRegisterComment,
    deleteComment
} from "../controllers/videoController";
import { onlyPublic, onlyPrivate } from "../localsMiddleware";

const apiRouter = express.Router();

apiRouter.post(routes.apiUpdateViews, postUpdateViews);
apiRouter.post(routes.apiRegisterComment, postRegisterComment); // onlyPrivate ???
apiRouter.delete(routes.apiDeleteComment, deleteComment); // onlyPrivate ???


export default apiRouter;
