import {IAppContext} from "../../components/appContext/appContext";
import express from "express";
import {container} from "../../container";
import {TYPES} from "../../types";
import {ISkuAttrService} from "../../modules/catalog/sku-attr/service/ISkuAttrService";
import {SkuAttrApi} from "../../modules/catalog/sku-attr/transport/skuAttrApi";
import authentication from "../../middlewares/authentication";

const skuAttrRouter  = (appContext: IAppContext) => {
    const router = express.Router();
    const SkuAttrService = container.get<ISkuAttrService>(TYPES.ISkuAttrService)
    const skuAttrApi = new SkuAttrApi(SkuAttrService);
    router.use(authentication())

    router.get('/', skuAttrApi.list())
    router.post('/:id', skuAttrApi.delete())
    return router
}

export default skuAttrRouter;