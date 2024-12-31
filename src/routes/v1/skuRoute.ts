import {IAppContext} from "../../components/appContext/appContext";
import express from "express";
import {container} from "../../container";
import {ISkuService} from "../../modules/catalog/sku/service/ISkuService";
import {TYPES} from "../../types";
import {SkuApi} from "../../modules/catalog/sku/transport/skuApi";
import authentication from "../../middlewares/authentication";

const skuRouter  = (appContext: IAppContext) => {
    const router = express.Router();
    const SkuService = container.get<ISkuService>(TYPES.ISkuService)
    const skuApi = new SkuApi(SkuService);
    //router.use(authentication())

    router.get('/', skuApi.list())
    return router
}

export default skuRouter;