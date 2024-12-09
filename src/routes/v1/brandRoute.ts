import {IAppContext} from "../../components/appContext/appContext";
import express from "express";
import {container} from "../../container";
import {IBrandService} from "../../modules/catalog/brand/service/IBrandService";
import {TYPES} from "../../types";
import {BrandApi} from "../../modules/catalog/brand/transport/brandApi";
import authentication from "../../middlewares/authentication";

const brandRouter = (appContext: IAppContext) => {
    const router = express.Router();
    const brandService = container.get<IBrandService>(TYPES.IBrandService)
    const brandApi = new BrandApi(brandService);

    router.use(authentication())

    router.post('/', brandApi.create())
    router.get('/', brandApi.list())
    router.get('/:id', brandApi.getById())
    return router
}

export default brandRouter;