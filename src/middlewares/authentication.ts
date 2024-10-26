import express from "express";
import {IAppContext} from "../components/appContext/appContext";
import {Err, Ok, Result} from "../libs/result";
import {InvalidToken, jwtProvider} from "../components/jwtProvider/jwtProvider";
import {ResultAsync} from "../libs/resultAsync";
import {writeErrorResponse} from "../libs/writeErrorResponse";
import {Requester, RequesterKey} from "../libs/requester";
import {AuthBiz} from "../modules/auth/biz/biz";
import {AuthMysqlRepo} from "../modules/auth/repository/mysql/mysqlRepo";
import {UserLocal} from "../modules/user/transport/local/local";
import {Hasher} from "../libs/hasher";

interface IAuthBiz {
    IntrospectToken: (token: string) => ResultAsync<Requester>
}

const getTokenString = (str?: string) : Result<string> => {
    if (!str) {
        return Err<string>(InvalidToken())
    }
    const parts = str.split(" ");
    if (parts[0] != "Bearer" || parts.length < 2 || parts[1].trim() == "" || parts[1].trim() == "null" ) {
        return Err<string>(InvalidToken())
    }
    return Ok<string>(parts[1])
}

export const authentication = (appCtx : IAppContext) : express.Handler =>  {
    const authRepo = new AuthMysqlRepo(appCtx.GetDbConnectionPool());
    const userRepo = new UserLocal(appCtx)
    const hasher = new Hasher()
    const appSecret = process.env.SYSTEM_SECRET
    const authBiz = new AuthBiz(authRepo,hasher,userRepo,new jwtProvider(appSecret!));


    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const authHeader = req.header("Authorization")
        const rT = getTokenString(authHeader)
        if (rT.isErr() ){
            writeErrorResponse(res,rT.error)
            return
        }
        const r = await authBiz.IntrospectToken(rT.data!);
        if (r.isErr() ){
            writeErrorResponse(res,r.error)
            return
        }
        console.log("data",r.data)
        res.locals.requester = r.data
        next()
    }
}

export default authentication;