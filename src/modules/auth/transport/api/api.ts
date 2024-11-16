import {AuthCreate, AuthLogin} from "../../entity/authVar";
import express from "express";
import {AppResponse} from "../../../../libs/response";
import {writeErrorResponse} from "../../../../libs/writeErrorResponse";
import {IAuthService} from "../../service/interface/IAuthService";

export interface IAuthApi {
    Register : express.Handler
    Login : express.Handler
}


export class AuthApi  implements IAuthApi {
    constructor(private readonly authBiz: IAuthService) {

    }

    Register: express.Handler = async (req, res, next) => {
        // this try catch required for errHandler and can't recovery the server when a panic happened
        try {
            const u = req.body as AuthCreate;

            const r = await this.authBiz.Register(u)
            if (r.isErr()) {
                writeErrorResponse(res, r.error)
                return
            }
            res.send(AppResponse.SimpleResponse(true))
        } catch (error) {
            next(error)
        }
    }

    Login: express.Handler = async (req, res, next) => {
        try {
            const u = req.body as AuthLogin;

            const r = await this.authBiz.Login(u)

            if (r.isErr()) {
                writeErrorResponse(res, r.error)
                return
            }
            res.send(AppResponse.SimpleResponse(r.value))
        } catch (error) {
            next(error)
        }

    }

}