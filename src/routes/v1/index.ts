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
import brandRouter from "./brandRoute";
import skuRouter from "./skuRoute";
import orderRoute from "./orderRoute";
import inventoryRouter from "./inventoryRoute";
import skuWholesalePriceRoute from "./skuWholesalePriceRoute";
import uploadRouter from "./uploadRoute";
import skuAttrRouter from "./skuAttrRoute";

import customerRoute from "./customerRoute";
import providerRouter from "./providerRouter";

import stockInRouter from "./stockInRoute";

import orderItemRoute from "./orderItemRoute";
import employeeRoute from "./employeeRoute";

import stockOutRouter from "./stockOutRoute";

import warrantyRouter from "./warrantyRoute";
import settingRouter from "./settingRoute";
import reportRoute from "./reportRoute";




const v1Router = () => {
    const appCtx = container.get<IAppContext>(TYPES.IAppContext)
    const router = express.Router();
    router.get("/ping", async (req, res) => {
        res.send("pong");
    })
    router.use("/report", reportRoute());
    router.use("/warranty",warrantyRouter());
    router.use("/users", usersRouter(appCtx))
    router.use("/auth", authRouter(appCtx))
    router.use("/audit", auditRouter(appCtx))
    router.use("/category", categoryRouter(appCtx))
    router.use("/brand", brandRouter(appCtx))
    router.use("/setting", settingRouter(appCtx))
    router.use("/spu", spuRouter(appCtx))
    router.use("/sku", skuRouter(appCtx))
    router.use("/order", orderRoute(appCtx))
    router.use("/order-item", orderItemRoute(appCtx))
    router.use("/inventory", inventoryRouter(appCtx))
    router.use("/stock-in", stockInRouter(appCtx))
    router.use("/stock-out", stockOutRouter(appCtx))
    router.use("/sku-wholesale-price", skuWholesalePriceRoute(appCtx))
    router.use("/upload", uploadRouter(appCtx))
    router.use("/sku-attr", skuAttrRouter(appCtx))
    router.use("/customer", customerRoute(appCtx))
    router.use("/provider", providerRouter(appCtx))
    router.use("/employee", employeeRoute(appCtx))
    return router;
}


// v1/auth/register


export default v1Router;