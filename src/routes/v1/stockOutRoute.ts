import express from "express";
import {IAppContext} from "../../components/appContext/appContext";
import {container} from "../../container";
import {IInventoryReportService} from "../../modules/inventory/service/IInventoryReportService";
import {TYPES} from "../../types";

import {StockOutApi} from "../../modules/stock/stockOut/transport/api";
import {IStockOutService} from "../../modules/stock/stockOut/service/IStockOutService";


const stockOutRouter = (appContext: IAppContext) => {
    const router = express.Router();
    const stockOutService = container.get<IStockOutService>(TYPES.IStockOutService);
    const stockOutApi = new StockOutApi(stockOutService);

    //router.use(authentication());
    //router.use(requiredRole(appContext, SystemRole.Admin, SystemRole.Owner, SystemRole.WarehouseStaff));


    router.get('/', stockOutApi.list());
    //router.get('/:id', stockOutApi.findById());
    router.post('/', stockOutApi.create());
    return router;
}

export default stockOutRouter;
