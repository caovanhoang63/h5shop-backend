import {IAppContext} from "../../../../components/appContext/appContext";
import {UserService} from "../../service/userService";
import express from "express";
import {UserCreate} from "../../entity/userCreate";
import {SystemRole} from "../../entity/user";
import {AppResponse} from "../../../../libs/response";
import {writeErrorResponse} from "../../../../libs/writeErrorResponse";
import {IUserService} from "../../service/IUserService";
import {Paging} from "../../../../libs/paging";


export class UserApi {
    private readonly userBiz: IUserService;

    constructor( biz: IUserService) {
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
    public ListUsers: express.Handler = async (req, res, next) => {
        const paging : Paging ={limit: 2, nextCursor: 0, page: 1, total: 0}
        const cond  = {}
        const result = await this.userBiz.listUsers(cond,paging)
        if (result.isErr()) {
            writeErrorResponse(res, result.error)
            return
        }
        res.send(AppResponse.SuccessResponse(result.value,paging,cond))
    }

}