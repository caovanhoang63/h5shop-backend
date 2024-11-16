// import express from "express";
// import {UserBiz} from "../../modules/user/service/service";
// import {UserApi} from "../../modules/user/transport/api/api";
// import {IAppContext} from "../../components/appContext/appContext";
// import authentication from "../../middlewares/authentication";
// import requiredRole from "../../middlewares/requiredRole";
// import {SystemRole} from "../../modules/user/entity/user";
//
// const userRouter = (appContext: IAppContext) => {
//     const router = express.Router();
//     const userRepo = new UserMysqlRepo(appContext.GetDbConnectionPool());
//     const userBiz = new UserBiz(userRepo);
//     const userApi = new UserApi(appContext, userBiz);
//     router.use(authentication(appContext))
//     router.use(requiredRole(appContext, SystemRole.Admin, SystemRole.Owner))
//     router.post('/', userApi.CreateNewUser)
//     router.get('/', userApi.ListUsers)
//     return router
// }
//
//
// export default userRouter;
