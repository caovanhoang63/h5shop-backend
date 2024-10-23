import {AuthCreate} from "../../entity/authVar";
import {ResultAsync} from "../../../../libs/resultAsync";
import express from "express";
import {AppResponse} from "../../../../libs/response";
import {SystemRole} from "../../../user/entity/user";

interface IAuthBiz {
    Register : (u : AuthCreate) => ResultAsync<void>
}

export class AuthApi {
    constructor(private readonly authBiz : IAuthBiz) {
    }

    Register :express.Handler  = async (req, res, next) =>  {
        const u : AuthCreate = {
            password: "",
            salt: "",
            userId: 1,
            userName: "12344",
            firstName: "cap",
            lastName: "hoang",
            systemRole: SystemRole.Admin
        }

        const r = await this.authBiz.Register(u)
        if (r.isErr() ){
            res.status(r.error!.code).send(AppResponse.ErrorResponse(r.error!));
            return
        }
        res.send(AppResponse.SimpleResponse(true))
    }


}