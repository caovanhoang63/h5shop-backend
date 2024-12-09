import {IBrandService} from "../service/IBrandService";
import express from "express";
import {BrandCreate} from "../entity/brandCreate";
import {ReqHelper} from "../../../../libs/reqHelper";
import {AppResponse} from "../../../../libs/response";
import {writeErrorResponse} from "../../../../libs/writeErrorResponse";

export class BrandApi {
    constructor(private readonly service : IBrandService) {}
    create() : express.Handler {
        return async (req, res, next) => {
            const body = req.body as BrandCreate;
            const requester =  ReqHelper.getRequester(res)
            const r = await this.service.create(requester,body)

            r.match(
                value => {
                    res.status(200).send(AppResponse.SimpleResponse(true))
                },
                e => {
                    writeErrorResponse(res,e)
                }
            )
        }
    }
}