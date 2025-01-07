import express from "express";
import {UserCreate} from "../entity/userCreate";
import {SystemRole} from "../entity/user";
import {AppResponse} from "../../../libs/response";
import {writeErrorResponse} from "../../../libs/writeErrorResponse";
import {IUserService} from "../service/IUserService";
import {ReqHelper} from "../../../libs/reqHelper";
import {UserUpdate} from "../entity/userUpdate";
import {createInvalidDataError} from "../../../libs/errors";


export class UserApi {
    private readonly userBiz: IUserService;

    constructor(biz: IUserService) {
        this.userBiz = biz;
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

    update() :express.Handler {
        return async (req: express.Request, res: express.Response) => {
            const body = req.body as UserUpdate;
            const id = parseInt(req.params.id);

            if (!id) {
                res.status(400).send(AppResponse.ErrorResponse(createInvalidDataError(new Error("id must be a number"))));
                return;
            }
            const requester = ReqHelper.getRequester(res);


            (await this.userBiz.update(requester,id,body)).match(
                r=> {
                    res.status(200).send(AppResponse.SimpleResponse(true))
                },
                e => {
                    writeErrorResponse(res,e)
                }
            )
        }
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