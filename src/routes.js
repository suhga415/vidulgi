// ONE single source of truth?!
// GLOBAL
const HOME = "/";
const JOIN = "/join";
const LOGIN = "/login";
const LOGOUT = "/logout";
const SEARCH = "/search";

// for Users
const USERS = "/users";
const USER_DETAIL = "/:id"; // /users/1
const EDIT_PROFILE = "/edit-profile";
const CHANGE_PASSWORD = "/change-password";
const ME = "/me";

// for Videos
const VIDEOS = "/videos";
const UPLOAD = "/upload";
const VIDEO_DETAIL = "/:id";
const EDIT_VIDEO = "/:id/edit"; // /video/1/edit
const DELETE_VIDEO = "/:id/delete";

// Github routes
const GITHUB = "/auth/github";
const GITHUB_CALLBACK = "/auth/github/callback";

// Facebook routes
const FACEBOOK = "/auth/facebook";
const FACEBOOK_CALLBACK = "/auth/facebook/callback";

// Google routes
const GOOGLE = "/auth/google";
const GOOGLE_CALLBACK = "/auth/google/callback";

// API routes
const API = "/api";
const API_UPDATE_VIEWS = "/:id/views";
const API_REGISTER_COMMENT = "/:id/comment";
const API_DELETE_COMMENT = "/:videoId/:commentId/delete-comment";

const routes = {
    home: HOME,
    join: JOIN,
    login: LOGIN,
    logout: LOGOUT,
    search: SEARCH,
    users: USERS,
    userDetail: (id) => {
        if (id) {
            return `/users/${id}`;
        } else {
            return USER_DETAIL;
        }
    },
    editProfile: EDIT_PROFILE,
    changePassword: CHANGE_PASSWORD,
    me: ME,
    videos: VIDEOS,
    upload: UPLOAD,
    videoDetail: (id) => {
        if (id) {
            return `/videos/${id}`;
        } else {
            return VIDEO_DETAIL;
        }
    },
    editVideo: (id) => {
        if (id) {
            return `/videos/${id}/edit`
        } else {
            return EDIT_VIDEO
        }
    },
    deleteVideo: id => {
        if (id) {
            return `/videos/${id}/delete`;
        } else {
            return DELETE_VIDEO;
        }
    },
    gitHub: GITHUB,
    githubCallback: GITHUB_CALLBACK,
    facebook: FACEBOOK,
    facebookCallback: FACEBOOK_CALLBACK,
    google: GOOGLE,
    googleCallback: GOOGLE_CALLBACK,

    api: API,
    apiUpdateViews: API_UPDATE_VIEWS,
    apiRegisterComment: API_REGISTER_COMMENT,
    apiDeleteComment: API_DELETE_COMMENT,

};

export default routes;