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
    router.use(authentication())

    router.get('/warning-stock', skuApi.listWarningStock())
    router.get('/search-detail', skuApi.searchDetail())
    router.get('/list-detail', skuApi.listDetail())
    router.get('/:id', skuApi.getDetailById())
    router.get('/', skuApi.list())
    router.delete('/:id', skuApi.delete())
    return router
}

export default skuRouter;