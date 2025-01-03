import express from "express";
import {ReqHelper} from "../../../libs/reqHelper";
import {AppResponse} from "../../../libs/response";
import {writeErrorResponse} from "../../../libs/writeErrorResponse";
import {createInvalidDataError} from "../../../libs/errors";
import {IEmployeeService} from "../service/IEmployeeService";
import {ProviderCreate} from "../../provider/entity/provider";
import {EmployeeCreate, EmployeeUpdate} from "../entity/employee";
import {EmployeeService} from "../service/employeeService";

export class EmployeeApi {
    constructor(private readonly service: IEmployeeService) {
    }

    create(): express.Handler {
        return async (req, res, next) => {
            const body = req.body as EmployeeCreate;
            const requester = ReqHelper.getRequester(res)
            const r = await this.service.create(requester, body)

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
            const r = await this.service.delete(requester, id)

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
            const body = req.body as EmployeeUpdate;
            const id = parseInt(req.params.id);

            if (!id) {
                res.status(400).send(AppResponse.ErrorResponse(createInvalidDataError(new Error("id must a number"))))
                return
            }

            const requester = ReqHelper.getRequester(res)
            const r = await this.service.update(requester, id, body)

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

    list(): express.Handler {
        return async (req, res, next) => {
            const cond = req.query
            const paging = ReqHelper.getPaging(req.query)
            const r = await this.service.list(cond, paging)

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

    getById(): express.Handler {
        return async (req, res, next) => {
            const id = parseInt(req.params.id);

            if (!id) {
                res.status(400).send(AppResponse.ErrorResponse(createInvalidDataError(new Error("id must be a number"))));
                return;
            }
            const r = await this.service.findById(id);
            r.match(
                value => {
                    res.status(200).send(AppResponse.SimpleResponse(value))
                },
                e => {
                    writeErrorResponse(res,e)
                }
            )

        }
    }
}