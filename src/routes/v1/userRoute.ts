import express from "express";
import {UserApi} from "../../modules/user/transport/api/api";
import {IAppContext} from "../../components/appContext/appContext";
import authentication from "../../middlewares/authentication";
import requiredRole from "../../middlewares/requiredRole";
import {SystemRole} from "../../modules/user/entity/user";
import {container} from "../../container";
import {TYPES} from "../../types";
import {IUserService} from "../../modules/user/service/IUserService";
import {IAuthService} from "../../modules/auth/service/interface/IAuthService";

const userRouter = (appContext: IAppContext) => {
    const router = express.Router();
    const authBiz = container.get<IUserService>(TYPES.IAuthService)
    const userApi = new UserApi(authBiz );

    router.use(authentication(appContext))
    router.use(requiredRole(appContext, SystemRole.Admin, SystemRole.Owner))

    router.post('/', userApi.CreateNewUser)
    router.get('/', userApi.ListUsers)
    return router
}


export default userRouter;
