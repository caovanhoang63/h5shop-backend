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

}