import {AuthCreate} from "../../entity/authVar";
import {ResultAsync} from "../../../../libs/resultAsync";
import express from "express";
import {AppResponse} from "../../../../libs/response";

interface IAuthBiz {
    Register : (u : AuthCreate) => ResultAsync<void>
}

export class AuthApi {
    constructor(private readonly authBiz : IAuthBiz) {}

    Register : express.Handler  = async (req, res, next) =>  {
        // this try catch required for errHandler and can't recovery the server when a panic happened
        try {
            const u = req.body as AuthCreate;

            const r = await this.authBiz.Register(u)
            if (r.isErr() ){
                console.log(r.error)
                res.status(r.error!.code).send(AppResponse.ErrorResponse(r.error!));
                return
            }
            res.send(AppResponse.SimpleResponse(true))
        } catch (error)  {
            next(error)
        }
    }
}