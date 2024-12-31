import {IAppContext} from "../../components/appContext/appContext";
import express from "express";
import {container} from "../../container";
import {TYPES} from "../../types";
import authentication from "../../middlewares/authentication";
import requiredRole from "../../middlewares/requiredRole";
import {SystemRole} from "../../modules/user/entity/user";
import {ISpuService} from "../../modules/catalog/spu/service/ISpuService";
import {SpuApi} from "../../modules/catalog/spu/transport/spuApi";

const spuRouter = (appContext: IAppContext) => {
    const router = express.Router();
    const SpuService = container.get<ISpuService>(TYPES.ISpuService)
    const spuApi = new SpuApi(SpuService);
    //router.use(authentication())

    router.get('/', spuApi.list())
    router.get('/:id', spuApi.getById())
    router.post('/upsert-detail', spuApi.upsertSpuDetail())
    router.use(requiredRole(appContext,SystemRole.Admin,SystemRole.Owner))
    router.post('/', spuApi.create())
    router.delete('/:id', spuApi.delete())
    router.patch('/:id', spuApi.update())
    return router
}

export default spuRouter;