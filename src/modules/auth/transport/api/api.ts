import express from "express";
import {AppResponse} from "../../../../libs/response";
import {writeErrorResponse} from "../../../../libs/writeErrorResponse";
import {IAuthService} from "../../service/interface/IAuthService";
import {AuthCreate} from "../../entity/authCreate";
import {AuthLogin} from "../../entity/authLogin";


export class AuthApi  {
    constructor(private readonly authBiz: IAuthService) {

    }

    Register: express.Handler = async (req, res, next) => {
        const u = req.body as AuthCreate;

        const r = await this.authBiz.register(u)
        if (r.isErr()) {
            writeErrorResponse(res, r.error)
            return
        }
        res.send(AppResponse.SimpleResponse(true))

    }

    Login: express.Handler = async (req, res, next) => {
        const u = req.body as AuthLogin;

        const r = await this.authBiz.login(u)

        if (r.isErr()) {
            writeErrorResponse(res, r.error)
            return
        }
        res.send(AppResponse.SimpleResponse(r.value))

    }

}