import {IAppContext} from "../../components/appContext/appContext";
import express from "express";
import {container} from "../../container";
import {TYPES} from "../../types";
import {IOrderService} from "../../modules/order/order/service/IOrderService";
import {OrderApi} from "../../modules/order/order/transport/OrderApi";
import authentication from "../../middlewares/authentication";

const orderRoute = (appContext: IAppContext) => {
    const router = express.Router();
    const orderService = container.get<IOrderService>(TYPES.IOrderService)
    const orderApi = new OrderApi(orderService);

    router.use(authentication())

    router.post('/', orderApi.create())
    router.delete('/:id', orderApi.delete())
    router.patch('/:id', orderApi.update())

    return router;
}

export default orderRoute;