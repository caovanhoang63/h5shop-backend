import {IAppContext} from "../../components/appContext/appContext";
import express from "express";
import {TYPES} from "../../types";
import {ISkuWholesalePriceService} from "../../modules/catalog/sku-wholesale-prices/service/ISkuWholesalePriceService";
import {container} from "../../container";
import authentication from "../../middlewares/authentication";
import {SkuWholesalePriceApi} from "../../modules/catalog/sku-wholesale-prices/transport/api";

const skuWholesalePriceRoute = (appContext: IAppContext) => {
    const router = express.Router();
    const SkuWholesalePriceService = container.get<ISkuWholesalePriceService>(TYPES.ISkuWholesalePriceService)
    const skuWholeSalePriceApi = new SkuWholesalePriceApi(SkuWholesalePriceService);
    router.use(authentication())

    router.get('/', skuWholeSalePriceApi.list())
    router.get('/:id', skuWholeSalePriceApi.getById())
    router.delete('/:id', skuWholeSalePriceApi.delete())
    return router
}

export default skuWholesalePriceRoute;