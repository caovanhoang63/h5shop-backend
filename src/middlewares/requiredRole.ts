import {IAppContext} from "../components/appContext/appContext";
import {SystemRole} from "../modules/user/entity/user";
import express from "express";
import {IRequester, RequesterKey} from "../libs/IRequester";
import {writeErrorResponse} from "../libs/writeErrorResponse";
import {createForbiddenError} from "../libs/errors";
import {IUserService} from "../modules/user/service/IUserService";
import {container} from "../container";
import {TYPES} from "../types";

const requiredRole = (appCtx: IAppContext, ...roles: SystemRole[]): express.Handler => {
    const userBiz = container.get<IUserService>(TYPES.IUserService);

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