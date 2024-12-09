import {IAppContext} from "../../components/appContext/appContext";
import express from "express";
import {InventoryMysqlRepo} from "../../modules/inventory/repository/mysql/mysqlInventoryRepo";
import {InventoryBiz} from "../../modules/inventory/biz/biz";
import {InventoryApi} from "../../modules/inventory/transport/api/api";

const  inventoryRoute = (appContext : IAppContext) => {
    const router = express.Router();
    const inventoryRepo = new InventoryMysqlRepo(appContext.GetDbConnectionPool());
    const inventoryBiz = new InventoryBiz(inventoryRepo);
    const inventoryApi = new InventoryApi(appContext,inventoryBiz);
    router.post('/inventory/create',inventoryApi.CreateNewItem)
    router.get('/inventory/list',inventoryApi.ListItems)
    return router
}
export default inventoryRoute;