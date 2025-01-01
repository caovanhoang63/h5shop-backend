import {IStockInService} from "../service/IStockInService";
import express from "express";
import {ReqHelper} from "../../../../libs/reqHelper";
import {inventoryReportFilterSchema} from "../../../inventory/entity/inventoryReportFilterSchema";
import {writeErrorResponse} from "../../../../libs/writeErrorResponse";
import {createInvalidDataError} from "../../../../libs/errors";
import {AppResponse} from "../../../../libs/response";
import {InventoryReportCreate} from "../../../inventory/entity/inventoryReport";
import {StockInCreate} from "../entity/stockIn";

export class StockInApi {
    constructor(private readonly service: IStockInService) {}
    findById(): express.Handler {
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
    }


    list(): express.Handler {
        return async (req, res, next) => {
            const paging = ReqHelper.getPaging(req.query);
            const value = inventoryReportFilterSchema.validate(req.query, { stripUnknown: true });

            if (value.error) {
                writeErrorResponse(res, createInvalidDataError(value.error));
                return;
            }
            const filter = req.query;
            const r = await this.service.list(filter, paging);

            r.match(
                value => {
                    res.status(200).send(AppResponse.SuccessResponse(value, paging, filter));
                },
                e => {
                    writeErrorResponse(res, e);
                }
            );
        };
    }

    create(): express.Handler {
        return async (req, res, next) => {
            const body = req.body as StockInCreate;
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