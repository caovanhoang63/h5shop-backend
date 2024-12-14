import express from "express";
import {IAppContext} from "../../components/appContext/appContext";
import {container} from "../../container";
import {IInventoryReportService} from "../../modules/inventory/service/IInventoryReportService";
import {TYPES} from "../../types";
import {InventoryReportApi} from "../../modules/inventory/transport/api";
import authentication from "../../middlewares/authentication";
import requiredRole from "../../middlewares/requiredRole";
import {SystemRole} from "../../modules/user/entity/user";


const inventoryReportRouter = (appContext: IAppContext) => {
    const router = express.Router();
    const inventoryReportService = container.get<IInventoryReportService>(TYPES.IInventoryReportService);
    const inventoryReportApi = new InventoryReportApi(inventoryReportService);

    //router.use(authentication());
   // router.use(requiredRole(appContext, SystemRole.Admin, SystemRole.Owner, SystemRole.WarehouseStaff));

    router.post('/', inventoryReportApi.create());
    router.get('/', inventoryReportApi.list());
    router.get('/table', inventoryReportApi.getInventoryReportsTable());
    router.get('/:id', inventoryReportApi.getById());
    router.put('/:id', inventoryReportApi.update());
    router.delete('/:id', inventoryReportApi.delete());
    router.get('/:id/details', inventoryReportApi.getInventoryReportDetails());

    return router;
}

export default inventoryReportRouter;

