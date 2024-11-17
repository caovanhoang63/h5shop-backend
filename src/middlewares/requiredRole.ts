import {IAppContext} from "../components/appContext/appContext";
import {SystemRole} from "../modules/user/entity/user";
import express from "express";
import {UserMysqlRepo} from "../modules/user/repository/implementation/mysqlRepo";
import {UserService} from "../modules/user/service/userService";
import {IRequester, RequesterKey} from "../libs/IRequester";
import {writeErrorResponse} from "../libs/writeErrorResponse";
import {createForbiddenError} from "../libs/errors";
import {PrmUserRepo} from "../modules/user/repository/implementation/prmUserRepo";

const requiredRole = (appCtx: IAppContext, ...roles: SystemRole[]): express.Handler => {
    const userRepo = new PrmUserRepo();
    const userBiz = new UserService(userRepo);

    return async (req, res, next) => {
        const requester = res.locals[RequesterKey] as IRequester;
        if (!requester) {
            writeErrorResponse(res, createForbiddenError())
            return
        }

        const r = await userBiz.requiredRole(requester, ...roles);
        if (r.isErr()) {
            writeErrorResponse(res, r.error)
            return
        }
        next()
    }
}

export default requiredRole;