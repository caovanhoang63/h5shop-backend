import express from "express";
import { InventoryReportCreate } from "../entity/inventoryReport";
import { AppResponse } from "../../../libs/response";
import { writeErrorResponse } from "../../../libs/writeErrorResponse";
import { IInventoryReportService } from "../service/IInventoryReportService";
import { ReqHelper } from "../../../libs/reqHelper";
import { createInvalidDataError } from "../../../libs/errors";
import {inventoryReportFilterSchema} from "../entity/inventoryReportFilterSchema";

export class InventoryReportApi {
    constructor(private readonly service: IInventoryReportService) {}

    create(): express.Handler {
        return async (req, res, next) => {
            const body = req.body as InventoryReportCreate;
            const requester =  ReqHelper.getRequester(res)
            const r = await this.service.createReport(requester,body);

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

    /*update(): express.Handler {
        return async (req, res, next) => {
            const id = parseInt(req.params.id);
            const body = req.body;

            if (!id) {
                res.status(400).send(AppResponse.ErrorResponse(createInvalidDataError(new Error("id must be a number"))));
                return;
            }

            const r = await this.service.updateReport(id, body);

            r.match(
                value => {
                    res.status(200).send(AppResponse.SimpleResponse(true));
                },
                e => {
                    writeErrorResponse(res, e);
                }
            );
        };
    }*/

    /*delete(): express.Handler {
        return async (req, res, next) => {
            const id = parseInt(req.params.id);

            if (!id) {
                res.status(400).send(AppResponse.ErrorResponse(createInvalidDataError(new Error("id must be a number"))));
                return;
            }

            const r = await this.service.deleteReport(id);

            r.match(
                value => {
                    res.status(200).send(AppResponse.SimpleResponse(true));
                },
                e => {
                    writeErrorResponse(res, e);
                }
            );
        };
    }*/

    findById(): express.Handler {
        return async (req, res, next) => {

            const id = parseInt(req.params.id);

            if (!id) {
                res.status(400).send(AppResponse.ErrorResponse(createInvalidDataError(new Error("id must be a number"))));
                return;
            }

            const r = await this.service.findById(id);

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
            const valueValidate = inventoryReportFilterSchema.validate(req.query, { stripUnknown: true });
            if (valueValidate.error) {
                writeErrorResponse(res, createInvalidDataError(valueValidate.error));
                return;
            }
            const r = await this.service.list(valueValidate.value, paging);

            r.match(
                value => {
                    res.status(200).send(AppResponse.SuccessResponse(value, paging, valueValidate));
                },
                e => {
                    writeErrorResponse(res, e);
                }
            );
        };
    }
}

