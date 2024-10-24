import {IAppContext} from "../../../../components/appContext/appContext";
import {UserBiz} from "../../biz/biz";
import {Result} from "../../../../libs/result";
import express from "express";
import {UserCreate} from "../../entity/userVar";
import {SystemRole, User} from "../../entity/user";
import {AppResponse} from "../../../../libs/response";
import {ICondition} from "../../../../libs/condition";
import {Paging} from "../../../../libs/paging";
import {ResultAsync} from "../../../../libs/resultAsync";

interface IUserBiz {
    CreateNewUser:  (u : UserCreate) => ResultAsync<any>
    FindByCondition : (cond: ICondition, paging: Paging)=> ResultAsync<User[]>
}

export class UserApi {
    private readonly appCtx: IAppContext;
    private readonly userBiz: UserBiz;
    constructor(appCtx : IAppContext, biz : UserBiz) {
        this.appCtx = appCtx;
        this.userBiz = biz;
    }
    public CreateNewUser : express.Handler = async (req, res, next)=> {
        const data : UserCreate= {
             firstName: "caovanhoang", lastName: "123", systemRole: SystemRole.Admin, userName : "123"
        };
        const result = await  this.userBiz.CreateNewUser(data);
        if (result.isErr() ){
            res.status(result.error!.code).send(AppResponse.ErrorResponse(result.error!));
            return
        }
        res.send(AppResponse.SimpleResponse(true))
    }
    public ListUsers : express.Handler = async (req, res, next)=> {
        const result = await this.userBiz.ListUsers()
        if (result.error != null ){
            console.log(result.error)
            res.status(result.error.code).send(AppResponse.ErrorResponse(result.error));
            return
        }
        res.send(AppResponse.SimpleResponse(result.data))
    }

}