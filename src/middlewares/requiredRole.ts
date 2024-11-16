import {IAppContext} from "../components/appContext/appContext";
import {SystemRole} from "../modules/user/entity/user";
import express from "express";
import {UserMysqlRepo} from "../modules/user/repository/implementation/mysqlRepo";
import {UserService} from "../modules/user/service/userService";
import {Requester, RequesterKey} from "../libs/requester";
import {writeErrorResponse} from "../libs/writeErrorResponse";
import {createForbiddenError} from "../libs/errors";

const requiredRole = (appCtx: IAppContext, ...roles: SystemRole[]): express.Handler => {
    const userRepo = new UserMysqlRepo(appCtx.GetDbConnectionPool());
    const userBiz = new UserService(userRepo);

    return async (req, res, next) => {
        const requester = res.locals[RequesterKey] as Requester;
        if (!requester) {
            writeErrorResponse(res, createForbiddenError())
            return
        }

        console.log(requester);
        const r = await userBiz.requiredRole(requester, ...roles);
        if (r.isErr()) {
            writeErrorResponse(res, r.error)
            return
        }
        next()
    }
}

export default requiredRole;