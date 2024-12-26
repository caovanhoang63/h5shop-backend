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
            const r = await this.service.createReport(body);

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

            const filter = value.value;
            const r = await this.service.listReports(filter, paging);

            r.match(
                value => {
                    res.status(200).send(AppResponse.SuccessResponse(value, paging, { filter: filter }));
                },
                e => {
                    writeErrorResponse(res, e);
                }
            );
        };
    }

    getById(): express.Handler {
        return async (req, res, next) => {
            const id = parseInt(req.params.id);

            if (!id) {
                res.status(400).send(AppResponse.ErrorResponse(createInvalidDataError(new Error("id must be a number"))));
                return;
            }

            const r = await this.service.getReportById(id);

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

    update(): express.Handler {
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
    }

    delete(): express.Handler {
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
    }

    getInventoryReportDetails(): express.Handler {
        return async (req, res, next) => {
            const reportId = parseInt(req.params.id);

            if (!reportId) {
                res.status(400).send(AppResponse.ErrorResponse(createInvalidDataError(new Error("id must be a number"))));
                return;
            }

            const r = await this.service.getInventoryReportDetails(reportId);

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

    getInventoryReportsTable(): express.Handler {
        return async (req, res, next) => {
            const paging = ReqHelper.getPaging(req.query);
            const value = inventoryReportFilterSchema.validate(req.query, { stripUnknown: true });

            if (value.error) {
                writeErrorResponse(res, createInvalidDataError(value.error));
                return;
            }
            const filter = req.query;
            const r = await this.service.getInventoryReportsTable(filter, paging);

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

