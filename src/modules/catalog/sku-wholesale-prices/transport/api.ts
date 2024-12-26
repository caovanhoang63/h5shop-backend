import {ISkuWholesalePriceService} from "../service/ISkuWholesalePriceService";
import express from "express";
import {AppResponse} from "../../../../libs/response";
import {createInvalidDataError} from "../../../../libs/errors";
import {ReqHelper} from "../../../../libs/reqHelper";
import {writeErrorResponse} from "../../../../libs/writeErrorResponse";

export class SkuWholesalePriceApi {
    constructor(private readonly service : ISkuWholesalePriceService) {}

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
            const cond = req.query;
            const paging = ReqHelper.getPaging(req.query);

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

    getById() : express.Handler {
        return async (req, res, next) => {
            const id = parseInt(req.params.id);
            if(!id){
                res.status(400).send(AppResponse.ErrorResponse(createInvalidDataError(new Error("id must a number"))))
                return
            }

            const r = await this.service.findById(id)

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