import {IAuditService} from "../service/IAuditService";
import {inject} from "inversify";
import {TYPES} from "../../../types";
import express, {query} from "express";
import {Paging} from "../../../libs/paging";
import {AppResponse} from "../../../libs/response";
import {ReqHelper} from "../../../libs/reqHelper";
import {writeErrorResponse} from "../../../libs/writeErrorResponse";

export class AuditApi {
    constructor(@inject(TYPES.IAuditService) private readonly auditService : IAuditService) {}
    list() : express.Handler {
        return async  (req , res) => {
            const paging = ReqHelper.getPaging(req.query)
            const requester = ReqHelper.getRequester(res)
            const result =  await this.auditService.list(requester,{},paging)
            if (result.isErr()) {
                writeErrorResponse(res, result.error)
                return
            }
            res.status(200).send(AppResponse.SuccessResponse(result.value,paging,{}))
            return
        }
    }
}