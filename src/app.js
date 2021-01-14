import path from "path";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import passport from "passport";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import globalRouter from "./routers/globalRouter";
import apiRouter from "./routers/apiRouters";
import routes from "./routes";
import { localsMiddleware } from "./localsMiddleware";
import "./passport";

// Server --------------------------------------------------
const app = express();
// ---------------------------------------------------------

const CookieStore = MongoStore(session)

// Midlewares ----------------------------------------------
app.use(helmet());
app.set("view engine", "pug");
// app.use("/uploads", express.static("uploads"));
app.set("views", path.join(__dirname, "views"));
app.use("/static", express.static(path.join(__dirname, "static")));
// When somebody goes to a "/uploads", 
//give him using express static, which is a built-in middleware to give files from a directory "uploads".
// it doesn't look for controllers or views. it will just look for a file. 
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        resave: false,
        saveUninitialized: false,
        store: new CookieStore({ mongooseConnection: mongoose.connection })
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(localsMiddleware);

// Routers (4)----------------------------------------------
app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);
app.use(routes.api, apiRouter);

// ---------------------------------------------------------
export default app;
// ^ when somebody else import my file, I will give him the 'app' object.