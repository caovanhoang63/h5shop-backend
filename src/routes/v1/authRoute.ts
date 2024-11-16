import {IAppContext} from "../../components/appContext/appContext";
import express from "express";
import {AuthService} from "../../modules/auth/service/implementation/authService";
import {AuthApi} from "../../modules/auth/transport/api/api";
import UserLocal from "../../modules/user/transport/local/local";
import {Hasher} from "../../libs/hasher";
import {jwtProvider} from "../../components/jwtProvider/IJwtProvider";
import {PrmAuthRepo} from "../../modules/auth/repository/implementation/prmAuthRepo";
import {container} from "../../container";
import {IAuthService} from "../../modules/auth/service/interface/IAuthService";
import {TYPES} from "../../types";


const authRouter = (appContext: IAppContext) => {
    const router = express.Router();
    const appSecret = process.env.SYSTEM_SECRET
    const hasher = new Hasher()
    const authRepo = new PrmAuthRepo();
    const userRepo = new UserLocal()
    const authBiz = container.get<IAuthService>(TYPES.IAuthService)
    const authApi = new AuthApi(authBiz)
    router.post('/register', authApi.Register)
    router.post('/login', authApi.Login)
    return router
}


export default authRouter;