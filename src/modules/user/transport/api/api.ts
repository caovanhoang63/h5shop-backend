import {IAppContext} from "../../../../components/appContext/appContext";
import {UserBiz} from "../../biz/biz";
import {Result} from "../../../../libs/result";
import express from "express";
import {UserCreate} from "../../entity/userVar";

interface IUserBiz {
    CreateNewUser:  (u : UserCreate) => Result<null>
}

export class UserApi {
    private appCtx: IAppContext;
    private userBiz: UserBiz;
    constructor(appCtx : IAppContext, biz : UserBiz) {
        this.appCtx = appCtx;
        this.userBiz = biz;
    }
    public CreateNewUser : express.Handler = (req, res, next)=> {
        const data = req.body as UserCreate;
        if (this.userBiz.CreateNewUser(data).Error != null ){
            res.status(400).send({})
        }
        res.status(200).send("oke")
    }
}