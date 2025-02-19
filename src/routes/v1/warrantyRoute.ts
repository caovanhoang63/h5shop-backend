import express from "express";
import {container} from "../../container";
import {WarrantyApi} from "../../modules/warranty/transport/warrantyApi";
import {TYPES} from "../../types";
import authentication from "../../middlewares/authentication";

const warrantyRouter = () => {
    const router = express.Router();
    const service = container.get<WarrantyApi>(TYPES.IWarrantyController)
    router.use(authentication())
    router.post("",service.create())
    router.get("",service.list())
    router.get("/:id",service.findById())
    router.patch("/:id", service.update())

    return router
}

export default warrantyRouter;