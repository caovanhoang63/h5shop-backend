import {IAppContext} from "../../components/appContext/appContext";
import express from "express";
import {AuthMysqlRepo} from "../../modules/auth/repository/mysql/mysqlRepo";
import {AuthBiz, IHasher} from "../../modules/auth/biz/biz";
import {AuthApi} from "../../modules/auth/transport/api/api";
import CryptoJS from 'crypto-js';
import {UserLocal} from "../../modules/user/transport/local/local";
import {Hasher} from "../../libs/hasher";
import {jwtProvider} from "../../components/jwtProvider/jwtProvider";



const  authRouter = (appContext : IAppContext) => {
    const router = express.Router();
    const appSecret = process.env.APP_SECRET
    const hasher = new Hasher()
    const authRepo = new AuthMysqlRepo(appContext.GetDbConnectionPool());
    const userRepo = new UserLocal(appContext)
    const authBiz = new AuthBiz(authRepo,hasher,userRepo, new jwtProvider(appSecret!));
    const authApi = new AuthApi(authBiz)


    router.post('/register',authApi.Register)



    return router
}


export default authRouter;