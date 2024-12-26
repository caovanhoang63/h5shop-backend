import {IStockInService} from "../service/IStockInService";
import express from "express";
import {ReqHelper} from "../../../../libs/reqHelper";
import {inventoryReportFilterSchema} from "../../../inventory/entity/inventoryReportFilterSchema";
import {writeErrorResponse} from "../../../../libs/writeErrorResponse";
import {createInvalidDataError} from "../../../../libs/errors";
import {AppResponse} from "../../../../libs/response";

export class StockInApi {
    constructor(private readonly service: IStockInService) {}



    getStockInTable(): express.Handler {
        return async (req, res, next) => {
            const paging = ReqHelper.getPaging(req.query);
            const value = inventoryReportFilterSchema.validate(req.query, { stripUnknown: true });

            if (value.error) {
                writeErrorResponse(res, createInvalidDataError(value.error));
                return;
            }
            const filter = req.query;
            const r = await this.service.getStockInTable(filter, paging);

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
}