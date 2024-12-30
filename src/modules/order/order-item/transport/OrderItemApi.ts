import {IOrderItemService} from "../service/IOrderItemService";
import {writeErrorResponse} from "../../../../libs/writeErrorResponse";
import {AppResponse} from "../../../../libs/response";
import {ReqHelper} from "../../../../libs/reqHelper";
import {OrderItemCreate} from "../entity/orderItemCreate";
import express from "express";
import {createInvalidDataError} from "../../../../libs/errors";
import {OrderItemUpdate} from "../entity/orderItemUpdate";

export class OrderItemApi {
    constructor(private readonly orderItemService: IOrderItemService) {}

    create(): express.Handler {
        return async (req, res, next) => {
            const body = req.body as OrderItemCreate;
            const requester = ReqHelper.getRequester(res)
            const r = await this.orderItemService.create(requester, body)

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
            const body = req.body as OrderItemUpdate;
            const orderId = parseInt(req.query.orderId as string);
            const skuId = parseInt(req.query.skuId as string);

            if (!orderId || !skuId) {
                res.status(400).send(AppResponse.ErrorResponse(createInvalidDataError(new Error("id must a number"))))
                return
            }

            const requester = ReqHelper.getRequester(res)
            const r = await this.orderItemService.update(requester, orderId, skuId, body)

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
            const orderId = parseInt(req.query.orderId as string);
            const skuId = parseInt(req.query.skuId as string);

            if (!orderId || !skuId) {
                res.status(400).send(AppResponse.ErrorResponse(createInvalidDataError(new Error("id must a number"))))
                return
            }

            const requester = ReqHelper.getRequester(res)
            const r = await this.orderItemService.delete(requester, orderId, skuId)

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