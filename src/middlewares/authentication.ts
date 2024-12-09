import express from "express";
import {InvalidToken} from "../components/jwtProvider/IJwtProvider";
import {writeErrorResponse} from "../libs/writeErrorResponse";
import {err, ok, Result} from "neverthrow";
import {Err} from "../libs/errors";
import {container} from "../container";
import {TYPES} from "../types";
import {IAuthService} from "../modules/auth/service/interface/IAuthService";

interface IAuthBiz {
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
    const authBiz = container.get<IAuthService>(TYPES.IAuthService);
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
        res.locals.requester = r.value
        next()
    }
}

export default authentication;