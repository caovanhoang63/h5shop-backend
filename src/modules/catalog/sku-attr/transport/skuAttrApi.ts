import {ISkuAttrService} from "../service/ISkuAttrService";
import {AppResponse} from "../../../../libs/response";
import {createInvalidDataError} from "../../../../libs/errors";
import {ReqHelper} from "../../../../libs/reqHelper";
import {writeErrorResponse} from "../../../../libs/writeErrorResponse";
import express from "express";

export class SkuAttrApi {
    constructor(private readonly service : ISkuAttrService) {}

    delete() : express.Handler {
        return async (req, res, next) => {
            const id = parseInt(req.params.id);
            if(!id){
                res.status(400).send(AppResponse.ErrorResponse(createInvalidDataError(new Error("id must a number"))))
                return
            }

            const requester = ReqHelper.getRequester(res)
            const r = await this.service.delete(requester,id)

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

    list() : express.Handler {
        return async (req, res, next) => {
            const cond = req.query
            const paging = ReqHelper.getPaging(req.query)

            const r = await this.service.list(cond,paging)
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