import {ICustomerService} from "../service/ICustomerService";
import {CustomerCreate} from "../entity/customerCreate";
import {ReqHelper} from "../../../libs/reqHelper";
import {AppResponse} from "../../../libs/response";
import {writeErrorResponse} from "../../../libs/writeErrorResponse";
import express from "express";
import {createInvalidDataError} from "../../../libs/errors";

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
            const phone = req.params.phone;

            if (!phone) {
                res.status(400).send(AppResponse.ErrorResponse(createInvalidDataError(new Error("Phone must be provided"))))
                return
            }

            const requester = ReqHelper.getRequester(res)
            const r = await this.customerService.update(requester, phone, body)

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
            const phone = req.params.phone;

            if (!phone) {
                res.status(400).send(AppResponse.ErrorResponse(createInvalidDataError(new Error("phone must be provided"))))
                return
            }
            const requester = ReqHelper.getRequester(res)
            const r = await this.customerService.delete(requester, phone)

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
            const phone = req.params.phone;

            if (!phone) {
                res.status(400).send(AppResponse.ErrorResponse(createInvalidDataError(new Error("phone must be provided"))))
                return
            }
            const requester = ReqHelper.getRequester(res)
            const r = await this.customerService.findById(requester, phone)

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
            const requester = ReqHelper.getRequester(res)
            const r = await this.customerService.list(requester)

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