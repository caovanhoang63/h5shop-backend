import express from "express";
import {ReqHelper} from "../../../../libs/reqHelper";
import {AppResponse} from "../../../../libs/response";
import {writeErrorResponse} from "../../../../libs/writeErrorResponse";
import {createInvalidDataError, createInvalidRequestError} from "../../../../libs/errors";
import {ISpuService} from "../service/ISpuService";
import {SpuCreate} from "../entity/spuCreate";
import {SpuUpdate} from "../entity/spuUpdate";
import {SpuDetailUpsert} from "../entity/spuDetailUpsert";
import {categoryFilterSchema} from "../../category/entity/CategoryFilterSchema";
import {SpuFilter, spuFilterSchema} from "../entity/spuFilterSchema";

export class SpuApi {
    constructor(private readonly service : ISpuService) {}
    create() : express.Handler {
        return async (req, res, next) => {
            const body = req.body as SpuCreate;
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

    delete() : express.Handler {
        return async (req, res, next) => {
            const id = parseInt(req.params.id);

            if (!id) {
                res.status(400).send(AppResponse.ErrorResponse(createInvalidDataError(new Error("id must a number"))))
                return
            }
            const requester =  ReqHelper.getRequester(res)
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

    update() : express.Handler {
        return async (req, res, next) => {
            const body = req.body as SpuUpdate;
            const id = parseInt(req.params.id);

            if (!id) {
                res.status(400).send(AppResponse.ErrorResponse(createInvalidDataError(new Error("id must a number"))))
                return
            }

            const requester =  ReqHelper.getRequester(res)
            const r = await this.service.update(requester,id,body)

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
            const value =  spuFilterSchema.validate(req.query, {stripUnknown: true});

            if (value.error) {
                writeErrorResponse(res,createInvalidRequestError(value.error))
                return
            }

            const filter: SpuFilter = value.value

            const r = await this.service.list(filter,paging)

            r.match(
                value => {
                    res.status(200).send(AppResponse.SuccessResponse(value,paging,filter))
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

            if (!id) {
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

    upsertSpuDetail() : express.Handler {
        return async (req, res, next) => {
            const body = req.body as SpuDetailUpsert;
            const requester =  ReqHelper.getRequester(res)
            const r = await this.service.upsertSpuDetail(requester,body)

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

    getDetail() : express.Handler {
        return async (req, res, next) => {
            const id = parseInt(req.params.id);

            if (!id) {
                res.status(400).send(AppResponse.ErrorResponse(createInvalidDataError(new Error("id must a number"))))
                return
            }

            const r = await this.service.getDetail(id)

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