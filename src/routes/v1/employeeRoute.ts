import {IAppContext} from "../../components/appContext/appContext";
import express from "express";
import {container} from "../../container";
import {IProviderService} from "../../modules/provider/service/IProviderService";
import {TYPES} from "../../types";
import {ProviderApi} from "../../modules/provider/transport/providerApi";
import authentication from "../../middlewares/authentication";
import {SystemRole} from "../../modules/user/entity/user";
import requiredRole from "../../middlewares/requiredRole";
import {IEmployeeService} from "../../modules/employee/service/IEmployeeService";
import {EmployeeApi} from "../../modules/employee/transport/employeeApi";

const employeeRoute = (appContext: IAppContext) => {
    const router = express.Router();
    const EmployeeService = container.get<IEmployeeService>(TYPES.IEmployeeService)
    const employeeApi = new EmployeeApi(EmployeeService);
    router.use(authentication())
    router.get("/", employeeApi.list())
    router.get("/:id", employeeApi.getById())
    router.use(requiredRole(appContext, SystemRole.Admin, SystemRole.Owner))
    router.post("/", employeeApi.create())
    router.delete('/:id', employeeApi.delete())
    router.patch('/:id', employeeApi.update())
    return router
};
export default employeeRoute;