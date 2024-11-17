import express from "express";
import {IAppContext} from "../components/appContext/appContext";
import {InvalidToken, jwtProvider} from "../components/jwtProvider/IJwtProvider";
import {writeErrorResponse} from "../libs/writeErrorResponse";
import {IRequester} from "../libs/IRequester";
import {AuthService} from "../modules/auth/service/implementation/authService";
import UserLocal from "../modules/user/transport/local/local";
import {Hasher} from "../libs/hasher";
import {PrmAuthRepo} from "../modules/auth/repository/implementation/prmAuthRepo";
import {err, ok, Result, ResultAsync} from "neverthrow";
import {Err} from "../libs/errors";

interface IAuthBiz {
    IntrospectToken: (token: string) => ResultAsync<IRequester, Err>
}

const getTokenString = (str?: string): Result<string, Err> => {
    if (!str) {
        return err(InvalidToken())
    }
    const parts = str.split(" ");
    if (parts[0] != "Bearer" || parts.length < 2 || parts[1].trim() == "" || parts[1].trim() == "null") {
        return err(InvalidToken())
    }
    return ok(parts[1])
}

export const authentication = (): express.Handler => {
    const authRepo = new PrmAuthRepo()
    const userRepo = new UserLocal()
    const hasher = new Hasher()
    const authBiz = new AuthService(authRepo, hasher, userRepo, new jwtProvider());


    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const authHeader = req.header("Authorization")
        const rT = getTokenString(authHeader)
        if (rT.isErr()) {
            writeErrorResponse(res, rT.error)
            return
        }
        const r = await authBiz.introspectToken(rT.value!);
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