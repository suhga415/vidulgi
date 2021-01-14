import express from "express";
import passport from "passport";
import routes from "../routes";
import {
    home,
    search
} from "../controllers/videoController";
import {
    getJoin,
    getLogin,
    postJoin,
    postLogin,
    logout,
    githubLogin,
    postGithubLogin,
    getMe,
    facebookLogin,
    postFacebookLogin,
    googleLogin,
    postGoogleLogin
} from "../controllers/userController";
import { onlyPublic, onlyPrivate } from "../localsMiddleware";

const globalRouter = express.Router();

globalRouter.get(routes.home, home);

globalRouter.get(routes.join, onlyPublic, getJoin);
globalRouter.post(routes.join, onlyPublic, postJoin, postLogin);

globalRouter.get(routes.login, onlyPublic, getLogin);
globalRouter.post(routes.login, onlyPublic, postLogin);

globalRouter.get(routes.search, search);
globalRouter.get(routes.logout, onlyPrivate, logout);

globalRouter.get(routes.google, googleLogin);
globalRouter.get(routes.googleCallback, 
    passport.authenticate('google', { failureRedirect: "/login" }),
    postGoogleLogin
);

globalRouter.get(routes.gitHub, githubLogin);
globalRouter.get(routes.githubCallback,
    passport.authenticate('github', { failureRedirect: '/login' }),
    postGithubLogin
);

globalRouter.get(routes.facebook, facebookLogin);
globalRouter.get(routes.facebookCallback,
    passport.authenticate("facebook", { failureRedirect: '/login' }),
    postFacebookLogin
);


globalRouter.get(routes.me, onlyPrivate, getMe);


// globalRouter.get(routes.home, (req, res) => res.send('Home'));
// globalRouter.get(routes.join, (req, res) => res.send('Join'));
// globalRouter.get(routes.login, (req, res) => res.send('Login'));
// globalRouter.get(routes.logout, (req, res) => res.send('Logout'));
// globalRouter.get(routes.search, (req, res) => res.send('Search'));

export default globalRouter;