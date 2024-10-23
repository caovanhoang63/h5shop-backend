import express from "express";
import usersRouter from "./userRoute";
import {IAppContext} from "../../components/appContext/appContext";

const v1Router = (appCtx : IAppContext) => {
    const router = express.Router();
    router.get("/ping", async (req, res) => {
        res.send("pong");
    })

    router.get('/', function(req, res, next) {
        res.render('index', { title: 'Express' });
    });

    router.use("/users", usersRouter(appCtx))
    return router;
}


export default v1Router;