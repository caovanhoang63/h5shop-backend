import {ISkuService} from "../service/ISkuService";
import express from "express";
import {ReqHelper} from "../../../../libs/reqHelper";
import {AppResponse} from "../../../../libs/response";
import {writeErrorResponse} from "../../../../libs/writeErrorResponse";
import {createInvalidDataError} from "../../../../libs/errors";

export class SkuApi {
    constructor(private readonly service : ISkuService) {}

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

    listDetail() : express.Handler {
        return async (req, res, next) => {
            const paging = ReqHelper.getPaging(req.query)

            const r = await this.service.listDetail({

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