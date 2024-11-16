import express from "express";
import {IAppContext} from "../components/appContext/appContext";
import {InvalidToken, jwtProvider} from "../components/jwtProvider/jwtProvider";
import {writeErrorResponse} from "../libs/writeErrorResponse";
import {Requester} from "../libs/requester";
import {AuthBiz} from "../modules/auth/biz/biz";
import {UserLocal} from "../modules/user/transport/local/local";
import {Hasher} from "../libs/hasher";
import {PrmAuthRepo} from "../modules/auth/repository/mysql/prmAuthRepo";
import {err, ok, Result, ResultAsync} from "neverthrow";
import {AppError} from "../libs/errors";

interface IAuthBiz {
    IntrospectToken: (token: string) => ResultAsync<Requester,AppError>
}

const getTokenString = (str?: string): Result<string,AppError> => {
    if (!str) {
        return err(InvalidToken())
    }
    const parts = str.split(" ");
    if (parts[0] != "Bearer" || parts.length < 2 || parts[1].trim() == "" || parts[1].trim() == "null") {
        return err(InvalidToken())
    }
    return ok(parts[1])
}

export const authentication = (appCtx: IAppContext): express.Handler => {
    const authRepo = new PrmAuthRepo()
    const userRepo = new UserLocal(appCtx)
    const hasher = new Hasher()
    const appSecret = process.env.SYSTEM_SECRET
    const authBiz = new AuthBiz(authRepo, hasher, userRepo, new jwtProvider(appSecret!));


    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const authHeader = req.header("Authorization")
        const rT = getTokenString(authHeader)
        if (rT.isErr()) {
            writeErrorResponse(res, rT.error)
            return
        }
        const r = await authBiz.IntrospectToken(rT.value!);
        if (r.isErr()) {
            writeErrorResponse(res, r.error)
            return
        }
        console.log("data", r.value)
        res.locals.requester = r.value
        next()
    }
}

export default authentication;