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
                    res.status(200).send(AppResponse.SimpleResponse(true))
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
                res.status(400).send(AppResponse.ErrorResponse(createInvalidDataError(new Error("id must a number"))))
                return
            }

            const requester = ReqHelper.getRequester(res)
            const r = await this.customerService.update(requester, id, body)

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
    delete(): express.Handler {
        return async (req, res, next) => {
            const id = parseInt(req.params.id);

            if (!id) {
                res.status(400).send(AppResponse.ErrorResponse(createInvalidDataError(new Error("id must a number"))))
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
}