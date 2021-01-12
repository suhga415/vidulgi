import passport from "passport";
import GithubStrategy from "passport-github";
import FacebookStrategy from "passport-facebook";
import GoogleStrategy from "passport-google-oauth20";
import User from "./models/User";
import {
    githubLoginCallback,
    facebookLoginCallback,
    googleLoginCallback
} from "./controllers/userController";
import routes from "./routes";

passport.use(User.createStrategy());

passport.use(
    new GithubStrategy(
        {
            clientID: process.env.GH_ID,
            clientSecret: process.env.GH_SECRET,
            callbackURL: `http://localhost:4000${routes.githubCallback}`
        },
        githubLoginCallback
    )
);

passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FB_ID,
            clientSecret: process.env.FB_SECRET,
            callbackURL: `https://tidy-cat-62.localtunnel.me${routes.facebookCallback}`,
            profileFields: ['id', 'displayName', 'photos', 'email'],
            scope: ['public_profile', 'email']
        },
        facebookLoginCallback
    )
);

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `http://localhost:4000${routes.googleCallback}`,
            scope: ['profile', 'email']
        },
        googleLoginCallback
    )
);

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function(id, done){ 
    User.findById(id, function(err, user){ 
        done(err, user); 
    }); 
});