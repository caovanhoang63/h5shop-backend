import {IAppContext} from "../../components/appContext/appContext";
import express from "express";
import {AuthApi} from "../../modules/auth/transport/api/api";
import {container} from "../../container";
import {IAuthService} from "../../modules/auth/service/interface/IAuthService";
import {TYPES} from "../../types";


const authRouter = (appContext: IAppContext) => {
    const router = express.Router();
    const authBiz = container.get<IAuthService>(TYPES.IAuthService)
    const authApi = new AuthApi(authBiz)
    router.post('/register', authApi.Register)
    router.post('/login', authApi.Login)
    return router
}


export default authRouter;