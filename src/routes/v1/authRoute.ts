import {IAppContext} from "../../components/appContext/appContext";
import express from "express";
import {AuthApi} from "../../modules/auth/transport/api/api";
import {container} from "../../container";
import {IAuthService} from "../../modules/auth/service/interface/IAuthService";
import {TYPES} from "../../types";
import authentication from "../../middlewares/authentication";
import requiredRole from "../../middlewares/requiredRole";
import {SystemRole} from "../../modules/user/entity/user";


const authRouter = (appContext: IAppContext) => {
    const router = express.Router();
    const authBiz = container.get<IAuthService>(TYPES.IAuthService)
    const authApi = new AuthApi(authBiz)
    router.post('/login', authApi.Login)
    // router.use(authentication())
    // router.use(requiredRole(appContext, SystemRole.Admin, SystemRole.Owner))
    router.post('/register', authApi.Register)
    return router
}


export default authRouter;