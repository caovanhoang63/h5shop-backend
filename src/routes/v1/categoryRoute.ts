import {IAppContext} from "../../components/appContext/appContext";
import express from "express";
import {container} from "../../container";
import {TYPES} from "../../types";
import authentication from "../../middlewares/authentication";
import requiredRole from "../../middlewares/requiredRole";
import {SystemRole} from "../../modules/user/entity/user";
import {ICategoryService} from "../../modules/catalog/category/service/ICategoryService";
import {CategoryApi} from "../../modules/catalog/category/transport/api";

const categoryRouter = (appContext: IAppContext) => {
    const router = express.Router();
    const categoryService = container.get<ICategoryService>(TYPES.ICategoryService)
    const categoryApi = new CategoryApi(categoryService);

    //router.use(authentication())

    router.get('/', categoryApi.list())
    router.get('/tree', categoryApi.getListTree())
    router.get('/:id', categoryApi.getById())
    router.post('/', categoryApi.create())
    router.delete('/:id',requiredRole(appContext,SystemRole.Admin,SystemRole.Owner), categoryApi.delete())
    router.patch('/:id', categoryApi.update())
    return router;
}

export default categoryRouter;