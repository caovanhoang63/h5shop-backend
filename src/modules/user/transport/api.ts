import express from "express";
import {UserCreate} from "../entity/userCreate";
import {SystemRole} from "../entity/user";
import {AppResponse} from "../../../libs/response";
import {writeErrorResponse} from "../../../libs/writeErrorResponse";
import {IUserService} from "../service/IUserService";
import {ReqHelper} from "../../../libs/reqHelper";


export class UserApi {
    private readonly userBiz: IUserService;

    constructor(biz: IUserService) {
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
        const paging = ReqHelper.getPaging(req.query);
        const cond = {}
        const result = await this.userBiz.listUsers(cond, paging)
        if (result.isErr()) {
            writeErrorResponse(res, result.error)
            return
        }
        res.send(AppResponse.SuccessResponse(result.value, paging, cond))
    }
    getProfile(): express.Handler {
        return async  (req, res) => {
            const requester = ReqHelper.getRequester(res);
            (await this.userBiz.getProfile(requester)).match(
                r=> {
                    res.status(200).send(AppResponse.SimpleResponse(r))
                },
                e=> {
                    writeErrorResponse(res, e);
                }
            )
        }
    }
}