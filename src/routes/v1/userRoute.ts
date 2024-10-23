import express from "express";
import {UserMysqlRepo} from "../../modules/user/repository/mysql/mysqlRepo";
import {UserBiz} from "../../modules/user/biz/biz";
import {UserApi} from "../../modules/user/transport/api/api";
import {IAppContext} from "../../components/appContext/appContext";

const  userRouter = (appContext : IAppContext) => {
    const router = express.Router();
    const userRepo = new UserMysqlRepo(appContext.GetDbConnectionPool());
    const userBiz = new UserBiz(userRepo);
    const userApi = new UserApi(appContext,userBiz);
    router.post('/',userApi.CreateNewUser)
    router.get('/',userApi.ListUsers)
    return router
}


export default userRouter;
