import {IAppContext} from "../../components/appContext/appContext";
import express from "express";
import {AuthMysqlRepo} from "../../modules/auth/repository/mysql/mysqlRepo";
import {AuthBiz} from "../../modules/auth/biz/biz";
import {AuthApi} from "../../modules/auth/transport/api/api";
import {UserLocal} from "../../modules/user/transport/local/local";
import {Hasher} from "../../libs/hasher";
import {jwtProvider} from "../../components/jwtProvider/jwtProvider";
import {PrmAuthRepo} from "../../modules/auth/repository/mysql/prmAuthRepo";


const authRouter = (appContext: IAppContext) => {
    const router = express.Router();
    const appSecret = process.env.SYSTEM_SECRET
    const hasher = new Hasher()
    const authRepo = new PrmAuthRepo();
    const userRepo = new UserLocal(appContext)
    const authBiz = new AuthBiz(authRepo, hasher, userRepo, new jwtProvider(appSecret!));
    const authApi = new AuthApi(authBiz)
    router.post('/register', authApi.Register)
    router.post('/login', authApi.Login)
    return router
}


export default authRouter;