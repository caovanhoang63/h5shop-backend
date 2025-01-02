import {ISkuService} from "../service/ISkuService";
import express from "express";
import {ReqHelper} from "../../../../libs/reqHelper";
import {AppResponse} from "../../../../libs/response";
import {writeErrorResponse} from "../../../../libs/writeErrorResponse";
import {createInvalidDataError} from "../../../../libs/errors";
import {FilterSkuListDetail} from "../entity/skuListDetail";

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
            const cond = req.query;

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

    searchDetail() : express.Handler {
        return async (req, res, next) => {
            const paging = ReqHelper.getPaging(req.query)
            const cond = req.query

            const r = await this.service.searchDetail(cond,paging)

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
            const cond: FilterSkuListDetail = {
                categoryId: req.query.categoryId ? parseInt(req.query.categoryId as string, 10) : undefined,
                brandId: req.query.brandId ? parseInt(req.query.brandId as string, 10) : undefined,
            };

            const r = await this.service.listDetail(cond,paging)

            r.match(
                value => {
                    res.status(200).send(AppResponse.SuccessResponse(value,paging,{}))
                },
                e => {
                    writeErrorResponse(res,e)
                }
            )
        }
    }

    getDetailById() : express.Handler {
        return async (req, res, next) => {
            const id = parseInt(req.params.id);

            if (!id) {
                res.status(400).send(AppResponse.ErrorResponse(createInvalidDataError(new Error("id must a number"))))
                return
            }

            const r = await this.service.getDetailById(id)

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