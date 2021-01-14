import passport from "passport";
import routes from "../routes";
import User from "../models/User";

export const getJoin = (req, res) =>
    res.render("join", { pageTitle: "Join" });

export const postJoin = async (req, res, next) => {
    // console.log(req.body) // thanks to bodyParser!
    // console.log(req.user);
    const {
        body: { name, email, password, password2 }
    } = req;
    if (password !== password2) {
        res.status(400); //'Status code 400' means 'Bad Request'.
        res.redirect(routes.join);
    } else {
        try {
            //Register user        
            const user = await User({
                name,
                email,
                avatarUrl: "https://vidulgi.s3.ap-northeast-2.amazonaws.com/avatars/anonymous-user-300x296.png"
            });
            await User.register(user, password);
            next();
        } catch (error) {
            console.log(error);
            res.redirect(routes.home);
        }
    }
};

export const getLogin = (req, res) => {
    res.render("login", { pageTitle: "Log In" });
}

export const postLogin =
    passport.authenticate('local',
        {
            failureRedirect: routes.login,
            successRedirect: routes.home
        }
    );


export const googleLogin = passport.authenticate('google');

export const googleLoginCallback = async (accessToken, refreshToken, profile, cb) => {
    const { _json: { sub, name, picture, email } } = profile;
    try {
        const user = await User.findOne({email});
        if (user) { // if found
            user.googleId = sub;
            user.save();
            return cb(null, user);
        } else { // not found --> create one
            const newUser = await User.create({
                name,
                email,
                avatarUrl: picture,
                googleId: sub
            });
            return cb(null, newUser);
        }
    } catch(error) {
        console.log(error);
    }
}

export const postGoogleLogin = (req, res) => {
    // Successful authentication, redirect secrets.
    res.redirect(routes.home);
}

export const githubLogin = passport.authenticate('github');

export const githubLoginCallback = async (_, __, profile, cb) => {
    // console.log(accessToken, refreshToken, profile, cb);
    const { _json: { id, avatar_url, name, email } } = profile;
    // console.log(profile);
    try {
        const user = await User.findOne({ email });
        if (user) { // if found
            user.githubId = id;
            user.save();
            return cb(null, user);
        } else { // not found --> create new one
            // const newUser = await User.create({
            //     email,
            //     name,
            //     githubId: id,
            //     avatarUrl: avatar_url
            // });
            const newUser = await new User({
                email,
                name,
                githubId: id,
                avatarUrl: avatar_url
            });
            newUser.save();
            return cb(null, newUser);
        }
    } catch (error) {
        return cb(error);
    }
};

export const postGithubLogin = (req, res) => {
    res.redirect(routes.home);
};

export const facebookLogin = passport.authenticate("facebook");

export const facebookLoginCallback = async (_, __, profile, cb) => {
    const { _json: { id, name, email } } = profile;
    try {
        const user = await User.findOne({ email });
        if (user) {
            user.facebookId = id;
            user.avatarUrl = `http://graph.facebook.com/${id}/picture?type=large`;
            user.save();
            return cb(null, user);
        }
        const newUser = await User.create({
            email,
            name,
            facebookId: id,
            avatarUrl: `http://graph.facebook.com/${id}/picture?type=large`
        });
        return cb(null, newUser);
    } catch (error) {
        return cb(error);
    }
};

export const postFacebookLogin = (req, res) => {
    res.redirect(routes.home);
};

export const logout = (req, res) => {
    req.logout();
    // const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.redirect(routes.home);
}

export const getMe = async (req, res) => {
    try {
        const user = await User.findOne({_id: req.user.id}).populate("myVideos");
        res.render("userDetail", { pageTitle: "User Detail", user });
    } catch(error) {
        console.log("error");
        res.redirect("routes.home")
    }
    
}

export const userDetail = async (req, res) => {
    const { params: { id } } = req;
    try {
        const user = await User.findById({_id: id}).populate("myVideos");
        res.render("userDetail", { pageTitle: "User Detail", user });
    } catch (error) {
        console.log(error);
        res.redirect(routes.home);
    }
}

export const getEditProfile = (req, res) => {
    res.render("editProfile", { pageTitle: "Edit Profile" });
}

export const getChangePassword = (req, res) => {
    res.render("changePassword", { pageTitle: "Change Password" });
}

export const postEditProfile = async (req, res) => {
    // edit profile
    const { 
        body: {name, email}, 
        file 
    } = req;
    try {
        await User.findByIdAndUpdate({_id: req.user._id}, 
            {name, email, avatarUrl: file ? file.location : req.user.avatarUrl});
        res.redirect(routes.me);
    } catch(err) {
        console.log(err);
        res.redirect(routes.me);
    }
}

export const postChangePassword = async (req, res) => {
    // change password... using method provided by passport-local-mongoose
    const { body: {passwordOld, passwordNew, passwordNew2} } = req;
    if (passwordNew === passwordNew2) {
        try {
            const user = req.user;
            await user.changePassword(passwordOld, passwordNew);
            res.redirect(routes.me);
        } catch (error) {
            res.status(400);
            res.redirect(`/users${routes.changePassword}`);
        }
    } else {
        res.status(400);
        res.redirect(`/users${routes.changePassword}`);
    }
}  