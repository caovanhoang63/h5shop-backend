import {IAppContext} from "../../components/appContext/appContext";
import express from "express";
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
    //router.use(requiredRole(appContext, SystemRole.Admin, SystemRole.Owner, SystemRole.WarehouseStaff));

    router.post('/', inventoryReportApi.createReport);
    router.get('/', inventoryReportApi.listReports);
    router.get('/:id', inventoryReportApi.getReportById);
    router.put('/:id', inventoryReportApi.updateReport);
    router.delete('/:id', inventoryReportApi.deleteReport);

    return router;
}

export default inventoryReportRouter;

