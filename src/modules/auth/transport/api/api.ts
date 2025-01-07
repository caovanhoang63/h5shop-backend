import express from "express";
import {AppResponse} from "../../../../libs/response";
import {writeErrorResponse} from "../../../../libs/writeErrorResponse";
import {IAuthService} from "../../service/interface/IAuthService";
import {AuthChangePassword, AuthCreate} from "../../entity/authCreate";
import {AuthLogin} from "../../entity/authLogin";
import {ReqHelper} from "../../../../libs/reqHelper";
import {EmployeeUpdate} from "../../../employee/entity/employee";
import {createInvalidDataError} from "../../../../libs/errors";


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

    changePassword: express.Handler = async (req, res, next) => {
        const body = req.body as AuthChangePassword;
        const id = parseInt(req.params.id);
        if (!id) {
            res.status(400).send(AppResponse.ErrorResponse(createInvalidDataError(new Error("id must a number"))))
            return
        }
        const requester = ReqHelper.getRequester(res)
        const r = await this.authBiz.changePassword(requester, id, body)
        r.match(
            value => {
                res.status(200).send(AppResponse.SimpleResponse(true))
            },
            e => {
                writeErrorResponse(res, e)
            }
        )
    }

}