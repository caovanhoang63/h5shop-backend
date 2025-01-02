import express from "express";
import {ReqHelper} from "../../../../libs/reqHelper";
import {inventoryReportFilterSchema} from "../../../inventory/entity/inventoryReportFilterSchema";
import {writeErrorResponse} from "../../../../libs/writeErrorResponse";
import {createInvalidDataError} from "../../../../libs/errors";
import {AppResponse} from "../../../../libs/response";
import {IStockOutService} from "../service/IStockOutService";
import {StockOutCreate} from "../entity/stockOut";

export class StockOutApi {
    constructor(private readonly service: IStockOutService) {}
    /*findById(): express.Handler {
        return async (req, res, next) => {
            const reportId = parseInt(req.params.id);

            if (!reportId) {
                res.status(400).send(AppResponse.ErrorResponse(createInvalidDataError(new Error("id must be a number"))));
                return;
            }

            const r = await this.service.findById(reportId);

            r.match(
                value => {
                    res.status(200).send(AppResponse.SimpleResponse(value));
                },
                e => {
                    writeErrorResponse(res, e);
                }
            );
        };
    }*/


    list(): express.Handler {
        return async (req, res, next) => {
            const paging = ReqHelper.getPaging(req.query);
            const valueCond = inventoryReportFilterSchema.validate(req.query, { stripUnknown: true });
            console.log(paging)
            if (valueCond.error) {
                writeErrorResponse(res, createInvalidDataError(valueCond.error));
                return;
            }
            const r = await this.service.list(req.query, paging);

            r.match(
                value => {
                    res.status(200).send(AppResponse.SuccessResponse(value, paging, valueCond));
                },
                e => {
                    writeErrorResponse(res, e);
                }
            );
        };
    }

    create(): express.Handler {
        return async (req, res, next) => {
            const body = req.body as StockOutCreate;
            const requester =  ReqHelper.getRequester(res)
            const r = await this.service.create( requester,body);

            r.match(
                value => {
                    res.status(200).send(AppResponse.SimpleResponse(value));
                },
                e => {
                    writeErrorResponse(res, e);
                }
            );
        };
    }
}