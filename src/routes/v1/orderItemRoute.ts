import {OrderItemApi} from "../../modules/order/order-item/transport/OrderItemApi";
import {TYPES} from "../../types";
import {IOrderItemService} from "../../modules/order/order-item/service/IOrderItemService";
import {container} from "../../container";
import express from "express";
import {IAppContext} from "../../components/appContext/appContext";

const OrderItemRoute = (appContext: IAppContext) => {
    const router = express.Router();
    const orderItemService = container.get<IOrderItemService>(TYPES.IOrderItemService)
    const orderItemApi = new OrderItemApi(orderItemService);

    // router.use(authentication())

    router.post('/', orderItemApi.create())
    router.delete('/', orderItemApi.delete())
    router.patch('/', orderItemApi.update())

    return router;
}

export default OrderItemRoute;