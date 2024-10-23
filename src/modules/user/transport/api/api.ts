import {IAppContext} from "../../../../components/appContext/appContext";
import {UserBiz} from "../../biz/biz";
import {Result} from "../../../../libs/result";
import express from "express";
import {UserCreate} from "../../entity/userVar";
import {SystemRole} from "../../entity/user";

interface IUserBiz {
    CreateNewUser:  (u : UserCreate) => Promise<Result<null>>
}

export class UserApi {
    private appCtx: IAppContext;
    private userBiz: UserBiz;
    constructor(appCtx : IAppContext, biz : UserBiz) {
        this.appCtx = appCtx;
        this.userBiz = biz;
    }
    public CreateNewUser : express.Handler = async (req, res, next)=> {
        const data : UserCreate= {
             firstName: "caovanhoang", lastName: "123123", systemRole: SystemRole.Admin
        };
        const result = await this.userBiz.CreateNewUser(data)
        if (result.Error != null ){
            console.log(result.Error)
            res.status(400).send({})
        }
        res.send({id : data.id})
    }
}