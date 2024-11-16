import express from "express";
import usersRouter from "./userRoute";
import {IAppContext} from "../../components/appContext/appContext";
import {TopicTest} from "../../libs/topics";
import {randomUUID} from "node:crypto";
import authRouter from "./authRoute";

const v1Router = (appCtx: IAppContext) => {
    const router = express.Router();

    router.get("/ping", async (req, res) => {
        res.send("pong");
    })

    router.get('/', function (req, res, next) {
        res.render('index', {title: 'Express'});
    });

    router.use("/users", usersRouter(appCtx))
    router.use("/auth", authRouter(appCtx))
    router.post("/pubsub/test", async (req, res, next) => {
        await appCtx.GetPubsub().Publish(TopicTest, {data: null, id: randomUUID(), topic: ""})
        res.status(200).send("oK")
    })

    router.post("/pubsub/test1", async (req, res, next) => {
        await appCtx.GetPubsub().Publish(TopicTest + "1", {data: null, id: randomUUID(), topic: ""})
        res.status(200).send("oK")
    })
    return router;
}


// v1/auth/register


export default v1Router;