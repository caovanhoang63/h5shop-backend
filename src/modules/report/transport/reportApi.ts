import {TYPES} from "../../../types";
import {inject, injectable} from "inversify";
import {IReportService} from "../service/IReportService";
import express from "express";
import {AppResponse} from "../../../libs/response";
import {writeErrorResponse} from "../../../libs/writeErrorResponse";
import Joi from "joi";
import {createInvalidRequestError} from "../../../libs/errors";

const schema = Joi.object({
    startDate: Joi.date().required().messages({
        'date.base': 'startDate must be a valid date',
        'any.required': 'startDate is required',
    }),
    endDate: Joi.date().required().min(Joi.ref('startDate')).messages({
        'date.base': 'endDate must be a valid date',
        'any.required': 'endDate is required',
        'date.min': 'endDate must be greater than or equal to startDate',
    }),
});

const schemaSkuOrder = Joi.object({
    startDate: Joi.date().required().messages({
        'date.base': 'startDate must be a valid date',
        'any.required': 'startDate is required',
    }),
    endDate: Joi.date().required().min(Joi.ref('startDate')).messages({
        'date.base': 'endDate must be a valid date',
        'any.required': 'endDate is required',
        'date.min': 'endDate must be greater than or equal to startDate',
    }),
    limit: Joi.number().required(),
    order: Joi.string().valid("revenue","amount").default("amount").required(),
});


@injectable()
export class ReportApi {
    constructor(@inject(TYPES.IReportService) private readonly reportService : IReportService) {
    }
    revenue(): express.Handler {
        return async (req :express.Request, res : express.Response) => {
            const { error, value } = schema.validate(req.query, { abortEarly: false });
            if (error) {
                writeErrorResponse(res, createInvalidRequestError(error));
                return
            }

            const { startDate, endDate } = value;
            ( await this.reportService.revenue(new Date(startDate), new Date(endDate))).match(
                (r) => {
                    res.status(200).send(AppResponse.SimpleResponse(r));
                },
                (e) => {
                    writeErrorResponse(res, e);
                }
            );
        };
    }
    totalOrder() : express.Handler {
        return async (req :express.Request, res : express.Response) => {
            const { error, value } = schema.validate(req.query, { abortEarly: false });
            if (error) {
                writeErrorResponse(res, createInvalidRequestError(error));
                return
            }
            const { startDate, endDate } = value;
            ( await this.reportService.totalOrder(new Date(startDate), new Date(endDate))).match(
                (r) => {
                    res.status(200).send(AppResponse.SimpleResponse(r));
                },
                (e) => {
                    writeErrorResponse(res, e);
                }
            );
        };
    }

    skuOrder() : express.Handler {
        return async (req :express.Request, res : express.Response) => {
            const { error, value } = schemaSkuOrder.validate(req.query, { abortEarly: false });
            if (error) {
                writeErrorResponse(res, createInvalidRequestError(error));
                return
            }
            const { startDate, endDate, limit, order } = value;
            ( await this.reportService.skuOrder(new Date(startDate), new Date(endDate),limit,order)).match(
                (r) => {
                    res.status(200).send(AppResponse.SimpleResponse(r));
                },
                (e) => {
                    writeErrorResponse(res, e);
                }
            );
        };
    }
    sale() : express.Handler {
        return async (req :express.Request, res : express.Response) => {
            const { error, value } = schema.validate(req.query, { abortEarly: false });
            if (error) {
                writeErrorResponse(res, createInvalidRequestError(error));
                return
            }
            const { startDate, endDate, limit, order } = value;
            ( await this.reportService.sale(new Date(startDate), new Date(endDate))).match(
                (r) => {
                    res.status(200).send(AppResponse.SimpleResponse(r));
                },
                (e) => {
                    writeErrorResponse(res, e);
                }
            );
        };
    }
    inventory() : express.Handler {
        return async (req :express.Request, res : express.Response) => {
            const schema = Joi.object({
                gtStock: Joi.number().integer().min(0).required(),
                ltStock: Joi.number().integer().min(0).required()
                    .greater(Joi.ref('gtStock')).message('"ltStock" must be greater than "gtStock"')
            });

            const { error, value } = schema.validate(req.query, { abortEarly: false });
            if (error) {
                writeErrorResponse(res, createInvalidRequestError(error));
                return
            }
            const { gtStock, ltStock } = value;
            ( await this.reportService.inventory(gtStock, ltStock)).match(
                (r) => {
                    res.status(200).send(AppResponse.SimpleResponse(r));
                },
                (e) => {
                    writeErrorResponse(res, e);
                }
            );
        };
    }
    category() : express.Handler {
        return async (req :express.Request, res : express.Response) => {
            const { error, value } = schema.validate(req.query, { abortEarly: false });
            if (error) {
                writeErrorResponse(res, createInvalidRequestError(error));
                return
            }
            const { startDate, endDate} = value;
            ( await this.reportService.category(new Date(startDate), new Date(endDate))).match(
                (r) => {
                    res.status(200).send(AppResponse.SimpleResponse(r));
                },
                (e) => {
                    writeErrorResponse(res, e);
                }
            );
        };
    }
    revenueAndExpenditure() : express.Handler {
        return async (req :express.Request, res : express.Response) => {
            const { error, value } = schema.validate(req.query, { abortEarly: false });
            if (error) {
                writeErrorResponse(res, createInvalidRequestError(error));
                return
            }
            const { startDate, endDate} = value;
            ( await this.reportService.revenueAndExpenditure(new Date(startDate), new Date(endDate))).match(
                (r) => {
                    res.status(200).send(AppResponse.SimpleResponse(r));
                },
                (e) => {
                    writeErrorResponse(res, e);
                }
            );
        };
    }
}