import {IAppContext} from "../../components/appContext/appContext";
import express from "express";
import {container} from "../../container";
import {TYPES} from "../../types";
import authentication from "../../middlewares/authentication";
import requiredRole from "../../middlewares/requiredRole";
import {SystemRole} from "../../modules/user/entity/user";
import {IAuditService} from "../../modules/audit/service/IAuditService";
import {AuditApi} from "../../modules/audit/transport/api";

const auditRouter = (appContext: IAppContext) => {
    const router = express.Router();
    const auditService = container.get<IAuditService>(TYPES.IAuditService)
    const auditApi = new AuditApi(auditService);

    router.use(authentication())
    router.use(requiredRole(appContext, SystemRole.Admin, SystemRole.Owner))

    router.get('/', auditApi.list())
    return router
}

export default auditRouter;