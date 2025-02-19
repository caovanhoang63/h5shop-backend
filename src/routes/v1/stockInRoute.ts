import express from "express";
import {IAppContext} from "../../components/appContext/appContext";
import {container} from "../../container";
import {IInventoryReportService} from "../../modules/inventory/service/IInventoryReportService";
import {TYPES} from "../../types";
import {InventoryReportApi} from "../../modules/inventory/transport/inventoryApi";
import authentication from "../../middlewares/authentication";
import requiredRole from "../../middlewares/requiredRole";
import {SystemRole} from "../../modules/user/entity/user";
import {IStockInService} from "../../modules/stock/stockIn/service/IStockInService";
import {StockInApi} from "../../modules/stock/stockIn/transport/api";


const stockInRouter = (appContext: IAppContext) => {
    const router = express.Router();
    const stockInService = container.get<IStockInService>(TYPES.IStockInService);
    const stockInApi = new StockInApi(stockInService);

    router.use(authentication());
    //router.use(requiredRole(appContext, SystemRole.Admin, SystemRole.Owner, SystemRole.WarehouseStaff));


    router.get('/', stockInApi.list());
    router.get('/:id', stockInApi.findById());
    router.post('/', stockInApi.create());
    return router;
}

export default stockInRouter;

