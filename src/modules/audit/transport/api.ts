import {IAuditService} from "../service/IAuditService";
import {inject} from "inversify";
import {TYPES} from "../../../types";
import express, {query} from "express";
import {AppResponse} from "../../../libs/response";
import {ReqHelper} from "../../../libs/reqHelper";
import {writeErrorResponse} from "../../../libs/writeErrorResponse";
import { AuditFilter } from "../entity/auditFilter";

export class AuditApi {
    constructor(@inject(TYPES.IAuditService) private readonly auditService: IAuditService) {
    }

    list(): express.Handler {
        return async (req, res) => {
            const paging = ReqHelper.getPaging(req.query)
            const requester = ReqHelper.getRequester(res)
            const auditFilter = {
                gtCreatedAt : req.query.gtCreatedAt,
                ltCreatedAt : req.query.ltCreatedAt,
                gtUpdatedAt : req.query.gtUpdatedAt,
                ltUpdatedAt : req.query.ltUpdatedAt,
                action : req.query.action,
                objectType : req.query.objectType,
            } as AuditFilter;

            console.log(auditFilter.objectType);

            const result = await this.auditService.list(requester, auditFilter, paging)
            if (result.isErr()) {
                writeErrorResponse(res, result.error)
                return
            }
            res.status(200).send(AppResponse.SuccessResponse(result.value, paging, {}))
            return
        }
    }
}