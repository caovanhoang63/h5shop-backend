import express from "express";
import {AppResponse} from "../../../../libs/response";
import {writeErrorResponse} from "../../../../libs/writeErrorResponse";
import {IAuthService} from "../../service/interface/IAuthService";
import {AuthCreate} from "../../entity/authCreate";
import {AuthLogin} from "../../entity/authLogin";
import {ReqHelper} from "../../../../libs/reqHelper";


export class AuthApi {
    constructor(private readonly authBiz: IAuthService) {
    }

    Register: express.Handler = async (req, res, next) => {
        const u = req.body as AuthCreate;
        const requester = ReqHelper.getRequester(res);

        const r = await this.authBiz.register(requester, u)
        if (r.isErr()) {
            writeErrorResponse(res, r.error)
            return
        }
        res.send(AppResponse.SimpleResponse(true))

    }

    Login: express.Handler = async (req, res, next) => {
        const u = req.body as AuthLogin;
        const requester = ReqHelper.getRequester(res);

        const r = await this.authBiz.login(requester, u)

        if (r.isErr()) {
            writeErrorResponse(res, r.error)
            return
        }
        res.send(AppResponse.SimpleResponse(r.value))

    }

}