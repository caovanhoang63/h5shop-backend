import {IAppContext} from "../components/appContext/appContext";
import {SystemRole} from "../modules/user/entity/user";
import express from "express";
import {UserMysqlRepo} from "../modules/user/repository/mysql/mysqlRepo";
import {UserBiz} from "../modules/user/biz/biz";
import {UserApi} from "../modules/user/transport/api/api";
import {Requester, RequesterKey} from "../libs/requester";
import {writeErrorResponse} from "../libs/writeErrorResponse";
import {newForbidden} from "../libs/errors";

const requiredRole = (appCtx : IAppContext, ...roles : SystemRole[]) : express.Handler =>  {
    const userRepo = new UserMysqlRepo(appCtx.GetDbConnectionPool());
    const userBiz = new UserBiz(userRepo);


    return async (req, res, next) => {
        const requester = res.locals[RequesterKey] as Requester;
        if (!requester) {
            writeErrorResponse(res,newForbidden())
            return
        }

        console.log(requester);
        const r = await userBiz.RequiredRole(requester,...roles);
        if (r.isErr()) {
            writeErrorResponse(res,r.error)
            return
        }
        next()
    }
}

export default requiredRole;