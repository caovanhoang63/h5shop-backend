import {ICustomerService} from "../service/ICustomerService";
import {CustomerCreate} from "../entity/customerCreate";
import {ReqHelper} from "../../../libs/reqHelper";
import {AppResponse} from "../../../libs/response";
import {writeErrorResponse} from "../../../libs/writeErrorResponse";
import express from "express";
import {createInvalidDataError} from "../../../libs/errors";
import {CustomerFilter} from "../entity/customerFilter";

export class CustomerApi {
    constructor(private readonly customerService: ICustomerService) {}

    create(): express.Handler {
        return async (req, res, next) => {
            const body = req.body as CustomerCreate;
            const requester = ReqHelper.getRequester(res)
            const r = await this.customerService.create(requester, body)

            r.match(
                value => {
                    res.status(200).send(AppResponse.SimpleResponse(value))
                },
                e => {
                    writeErrorResponse(res, e)
                }
            )
        }
    }

    update(): express.Handler {
        return async (req, res, next) => {
            const body = req.body as CustomerCreate;
            const id = parseInt(req.params.id);

            if (!id) {
                res.status(400).send(AppResponse.ErrorResponse(createInvalidDataError(new Error("id must be provided"))))
                return
            }

            const requester = ReqHelper.getRequester(res)
            const r = await this.customerService.update(requester, id, body)

            r.match(
                value => {
                    res.status(200).send(AppResponse.SimpleResponse(value))
                },
                e => {
                    writeErrorResponse(res, e)
                }
            )
        }
    }

    delete(): express.Handler {
        return async (req, res, next) => {
            const id = parseInt(req.params.id);

            if (!id) {
                res.status(400).send(AppResponse.ErrorResponse(createInvalidDataError(new Error("phone must be provided"))))
                return
            }
            const requester = ReqHelper.getRequester(res)
            const r = await this.customerService.delete(requester, id)

            r.match(
                value => {
                    res.status(200).send(AppResponse.SimpleResponse(true))
                },
                e => {
                    writeErrorResponse(res, e)
                }
            )
        }
    }

    findById(): express.Handler {
        return async (req, res, next) => {
            const id = parseInt(req.params.id);

            if (!id) {
                res.status(400).send(AppResponse.ErrorResponse(createInvalidDataError(new Error("id must be provided"))))
                return
            }

            const r = await this.customerService.findById(id)

            r.match(
                value => {
                    res.status(200).send(AppResponse.SimpleResponse(value))
                },
                e => {
                    writeErrorResponse(res, e)
                }
            )
        }
    }

    list(): express.Handler {
        return async (req, res, next) => {
            const filter = {
                status: req.query.status,
                lkCustomerPhoneNumber : req.query.lkCustomerPhoneNumber,
                gtCreatedAt : req.query.gtCreatedAt,
                ltCreatedAt : req.query.ltCreatedAt,
                gtUpdatedAt : req.query.gtUpdatedAt,
                ltUpdatedAt : req.query.ltUpdatedAt
            } as CustomerFilter;

            const paging = ReqHelper.getPaging(req.query);

            const r = await this.customerService.list(filter, paging);

            r.match(
                value => {
                    res.status(200).send(AppResponse.SimpleResponse(value))
                },
                e => {
                    writeErrorResponse(res, e)
                }
            )
        }
    }
}