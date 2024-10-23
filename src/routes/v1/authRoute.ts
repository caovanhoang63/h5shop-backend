import {IAppContext} from "../../components/appContext/appContext";
import express from "express";
import {AuthMysqlRepo} from "../../modules/auth/repository/mysql/mysqlRepo";
import {AuthBiz, IHasher} from "../../modules/auth/biz/biz";
import {AuthApi} from "../../modules/auth/transport/api/api";
import CryptoJS from 'crypto-js';
import {UserLocal} from "../../modules/user/transport/local/local";

class Hasher implements IHasher {
    hash (value: string, salt: string)  {
        return CryptoJS.SHA256(CryptoJS.enc.Hex.parse(value + salt)).toString(CryptoJS.enc.Hex);
    };
}


const  authRouter = (appContext : IAppContext) => {
    const router = express.Router();

    const hasher = new Hasher()
    const authRepo = new AuthMysqlRepo(appContext.GetDbConnectionPool());
    const userRepo = new UserLocal(appContext)
    const authBiz = new AuthBiz(authRepo,hasher,userRepo);
    const authApi = new AuthApi(authBiz)
    router.post('/register',authApi.Register)
    return router
}


export default authRouter;