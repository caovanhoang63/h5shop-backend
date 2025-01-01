import {IAppContext} from "../../components/appContext/appContext";
import {TYPES} from "../../types";
import {ICustomerService} from "../../modules/customer/service/ICustomerService";
import {container} from "../../container";
import express from "express";
import authentication from "../../middlewares/authentication";
import {CustomerApi} from "../../modules/customer/transport/CustomerApi";

const customerRoute = (appContext: IAppContext) => {
    const router = express.Router();
    const customerService = container.get<ICustomerService>(TYPES.ICustomerService)
    const customerApi = new CustomerApi(customerService);

    // router.use(authentication())

    router.post('/', customerApi.create())
    router.delete('/:id', customerApi.delete())
    router.patch('/:id', customerApi.update())
    router.get('/:id', customerApi.findById())
    router.get('/', customerApi.list())

    return router;
}

export default customerRoute;