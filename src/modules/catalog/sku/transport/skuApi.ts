import {ISkuService} from "../service/ISkuService";
import express from "express";
import {ReqHelper} from "../../../../libs/reqHelper";
import {AppResponse} from "../../../../libs/response";
import {writeErrorResponse} from "../../../../libs/writeErrorResponse";

export class SkuApi {
    constructor(private readonly service : ISkuService) {}

    list() : express.Handler {
        return async (req, res, next) => {
            const paging = ReqHelper.getPaging(req.query)

            const r = await this.service.list({

            },paging)

            r.match(
                value => {
                    res.status(200).send(AppResponse.SimpleResponse(value))
                },
                e => {
                    writeErrorResponse(res,e)
                }
            )
        }
    }
}