import {IAppContext} from "../../../../components/appContext/appContext";
import {UserService} from "../../service/userService";
import express from "express";
import {UserCreate} from "../../entity/userVar";
import {SystemRole} from "../../entity/user";
import {AppResponse} from "../../../../libs/response";
import {writeErrorResponse} from "../../../../libs/writeErrorResponse";
import {IUserBiz} from "../../service/IUserBiz";


export class UserApi {
    private readonly appCtx: IAppContext;
    private readonly userBiz: IUserBiz;

    constructor(appCtx: IAppContext, biz: UserService) {
        this.appCtx = appCtx;
        this.userBiz = biz;
    }

    public CreateNewUser: express.Handler = async (req, res, next) => {
        const data: UserCreate = {
            firstName: "caovanhoang", lastName: "123", systemRole: SystemRole.Admin, userName: "123"
        };
        const result = await this.userBiz.createNewUser(data);
        if (result.isErr()) {
            writeErrorResponse(res, result.error)
            return
        }
        res.send(AppResponse.SimpleResponse(true))
    }
    // public ListUsers: express.Handler = async (req, res, next) => {
    //     const result = await this.userBiz.listUsers()
    //     if (result.isErr()) {
    //         writeErrorResponse(res, result.error)
    //         return
    //     }
    //     res.send(AppResponse.SimpleResponse(result.value))
    // }

}