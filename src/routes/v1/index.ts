import express from "express";
import usersRouter from "./userRoute";
import {IAppContext} from "../../components/appContext/appContext";
import authRouter from "./authRoute";
import authentication from "../../middlewares/authentication";

const v1Router = (appCtx : IAppContext) => {
    const router = express.Router();

    router.get("/ping", async (req, res) => {
        res.send("pong");
    })

    router.get('/', function(req, res, next) {
        res.render('index', { title: 'Express' });
    });

    router.use("/users", usersRouter(appCtx))
    router.use("/auth",authRouter(appCtx))
    return router;
}


// v1/auth/register






export default v1Router;