import {IOrderService} from "../service/IOrderService";
import {OrderCreate} from "../entity/orderCreate";
import {ReqHelper} from "../../../../libs/reqHelper";
import express from "express";
import {writeErrorResponse} from "../../../../libs/writeErrorResponse";
import {AppResponse} from "../../../../libs/response";
import {createInvalidDataError} from "../../../../libs/errors";
import {OrderUpdate} from "../entity/orderUpdate";
import {PayOrder} from "../entity/order";

export class OrderApi {
    constructor(private readonly userService: IOrderService) {}

    create(): express.Handler {
        return async (req, res, next) => {
            const body = req.body as OrderCreate;
            const requester = ReqHelper.getRequester(res)
            const r = await this.userService.create(requester, body)

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
            const body = req.body as OrderUpdate;
            const id = parseInt(req.params.id);

            if (!id) {
                res.status(400).send(AppResponse.ErrorResponse(createInvalidDataError(new Error("id must a number"))))
                return
            }

            const requester = ReqHelper.getRequester(res)
            const r = await this.userService.update(requester, id, body)

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
                res.status(400).send(AppResponse.ErrorResponse(createInvalidDataError(new Error("id must a number"))))
                return
            }
            const requester = ReqHelper.getRequester(res)
            const r = await this.userService.delete(requester, id)

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
                res.status(400).send(AppResponse.ErrorResponse(createInvalidDataError(new Error("id must a number"))))
                return
            }

            const r = await this.userService.findById(id)

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
            const cond = req.query as any;
            const r = await this.userService.list(cond)

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

    payOrder() : express.Handler {
        return async (req, res) => {
            const id = parseInt(req.params.id);
            const payOrder = {
                isUsePoint: req.body.isUsePoint,
            } as PayOrder;
            if (!id) {
                res.status(400).send(AppResponse.ErrorResponse(createInvalidDataError(new Error("id must a number"))))
                return
            }
            const requester = ReqHelper.getRequester(res);
            (await this.userService.payOrder(requester, id,payOrder)).match(
                value => {
                    res.status(200).send(AppResponse.SimpleResponse(value))
                },
                e =>{
                    writeErrorResponse(res, e)
                }
            )

        }
    }

    removeCustomer(): express.Handler {
        return async (req, res, next) => {
            const id = parseInt(req.params.id);

            if (!id) {
                res.status(400).send(AppResponse.ErrorResponse(createInvalidDataError(new Error("id must a number"))))
                return
            }

            const requester = ReqHelper.getRequester(res)
            const r = await this.userService.removeCustomer(requester, id)

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