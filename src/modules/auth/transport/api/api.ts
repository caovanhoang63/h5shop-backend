import {AuthCreate, AuthLogin, TokenResponse} from "../../entity/authVar";
import {ResultAsync} from "../../../../libs/resultAsync";
import express from "express";
import {AppResponse} from "../../../../libs/response";
import {writeErrorResponse} from "../../../../libs/writeErrorResponse";

interface IAuthBiz {
    Register : (u : AuthCreate) => ResultAsync<void>
    Login : (u: AuthLogin) => ResultAsync<TokenResponse>
}

export class AuthApi {
    constructor(private readonly authBiz : IAuthBiz) {}

    Register : express.Handler  = async (req, res, next) =>  {
        // this try catch required for errHandler and can't recovery the server when a panic happened
        try {
            const u = req.body as AuthCreate;

            const r = await this.authBiz.Register(u)
            if (r.isErr() ){
                writeErrorResponse(res,r.error)
                return
            }
            res.send(AppResponse.SimpleResponse(true))
        } catch (error)  {
            next(error)
        }
    }

    Login : express.Handler  = async (req, res, next) =>  {
        try {
            const u = req.body as AuthLogin;

            const r = await this.authBiz.Login(u)

            if (r.isErr() ){
                writeErrorResponse(res,r.error)
                return
            }
            res.send(AppResponse.SimpleResponse(r.data))
        }catch (error)  {
            next(error)
        }

    }

}