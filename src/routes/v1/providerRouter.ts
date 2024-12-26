import {IAppContext} from "../../components/appContext/appContext";
import express from "express";
import {container} from "../../container";
import {IProviderService} from "../../modules/provider/service/IProviderService";
import {TYPES} from "../../types";
import {ProviderApi} from "../../modules/provider/transport/providerApi";
import authentication from "../../middlewares/authentication";
import {SystemRole} from "../../modules/user/entity/user";
import requiredRole from "../../middlewares/requiredRole";

const providerRouter = (appContext: IAppContext) => {
    const router = express.Router();
    const ProviderService = container.get<IProviderService>(TYPES.IProviderService)
    const providerApi = new ProviderApi(ProviderService);
    router.use(authentication())
    router.get("/", providerApi.list())
    router.get("/:id", providerApi.getById())
    router.use(requiredRole(appContext, SystemRole.Admin, SystemRole.Owner))
    router.post("/", providerApi.create())
    router.delete('/:id', providerApi.delete())
    router.patch('/:id', providerApi.update())
    return router
};
export default providerRouter;