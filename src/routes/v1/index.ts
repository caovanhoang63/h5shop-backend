import express from "express";
import usersRouter from "./userRoute";
import {IAppContext} from "../../components/appContext/appContext";
import {topicTest} from "../../libs/topics";
import {randomUUID} from "node:crypto";
import authRouter from "./authRoute";
import auditRouter from "./auditRoute";
import {container} from "../../container";
import {TYPES} from "../../types";
import categoryRouter from "./categoryRoute";
import spuRouter from "./spuRoute";
import inventoryRouter from "./inventoryRoute";

const v1Router = () => {
    const appCtx = container.get<IAppContext>(TYPES.IAppContext)
    const router = express.Router();

    router.get("/ping", async (req, res) => {
        res.send("pong");
    })

    router.get('/', function (req, res, next) {
        res.render('index', {title: 'Express'});
    });

    router.use("/users", usersRouter(appCtx))
    router.use("/auth", authRouter(appCtx))
    router.use("/audit", auditRouter(appCtx))
    router.use("/category", categoryRouter(appCtx))
    router.use("/spu", spuRouter(appCtx))
    router.use("/inventory", inventoryRouter(appCtx))
    router.post("/pubsub/test", async (req, res, next) => {
        await appCtx.GetPubsub().Publish(topicTest, {data: null, id: randomUUID(), topic: ""})
        res.status(200).send("oK")
    })

    router.post("/pubsub/test1", async (req, res, next) => {
        await appCtx.GetPubsub().Publish(topicTest + "1", {data: null, id: randomUUID(), topic: ""})
        res.status(200).send("oK")
    })
    return router;
}


// v1/auth/register


export default v1Router;