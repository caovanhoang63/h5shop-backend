import {IAppContext} from "../../components/appContext/appContext";
import express from "express";
import {container} from "../../container";
import {TYPES} from "../../types";
import SettingApi from "../../modules/setting/transport/settingApi";
import authentication from "../../middlewares/authentication";

const settingRouter = (appContext: IAppContext) => {
    const router = express.Router();
    const settingService = container.get<SettingApi>(TYPES.ISettingController);

    router.use(authentication())

    router.post('',settingService.create())
    router.get('/:name',settingService.findByName())
    router.get('',settingService.find())
    router.patch('/:name',settingService.update())
    router.delete('/:name',settingService.delete())

    return router
};
export default settingRouter;