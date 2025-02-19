import express from "express";
import {UserApi} from "../../modules/user/transport/api";
import {IAppContext} from "../../components/appContext/appContext";
import authentication from "../../middlewares/authentication";
import requiredRole from "../../middlewares/requiredRole";
import {SystemRole} from "../../modules/user/entity/user";
import {container} from "../../container";
import {TYPES} from "../../types";
import {IUserService} from "../../modules/user/service/IUserService";

const userRouter = (appContext: IAppContext) => {
    const router = express.Router();
    const authBiz = container.get<IUserService>(TYPES.IUserService)
    const userApi = new UserApi(authBiz);

    router.use(authentication())
    router.patch('/:id', userApi.update())
    router.get("/profile",userApi.getProfile())
    router.use(requiredRole(appContext, SystemRole.Admin, SystemRole.Owner))
    router.get('/', userApi.ListUsers)
    // router.patch('/:id"', userApi.update())
    return router
}


export default userRouter;
