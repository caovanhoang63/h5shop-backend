import express from "express";
import {UserApi} from "../../modules/user/transport/api/api";
import {IAppContext} from "../../components/appContext/appContext";
import authentication from "../../middlewares/authentication";
import requiredRole from "../../middlewares/requiredRole";
import {SystemRole} from "../../modules/user/entity/user";
import {PrmUserRepo} from "../../modules/user/repository/implementation/prmUserRepo";
import {UserService} from "../../modules/user/service/userService";

const userRouter = (appContext: IAppContext) => {
    const router = express.Router();
    const userRepo = new PrmUserRepo()
    const userBiz = new UserService(userRepo);
    const userApi = new UserApi(appContext, userBiz);
    router.use(authentication(appContext))
    router.use(requiredRole(appContext, SystemRole.Admin, SystemRole.Owner))
    router.post('/', userApi.CreateNewUser)
    router.get('/', userApi.ListUsers)
    return router
}


export default userRouter;
