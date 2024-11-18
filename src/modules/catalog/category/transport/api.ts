import * as Http from "node:http";
import {ICategoryService} from "../service/ICategoryService";
import express from "express";
import {categoryCreate} from "../entity/categoryCreate";
import {ReqHelper} from "../../../../libs/reqHelper";
import {AppResponse} from "../../../../libs/response";
import {writeErrorResponse} from "../../../../libs/writeErrorResponse";
import {categoryUpdate} from "../entity/categoryUpdate";
import {createInvalidDataError} from "../../../../libs/errors";


export class CategoryApi {
    constructor(private readonly service : ICategoryService) {}
    create() : express.Handler {
      return async (req, res, next) => {
          const body = req.body as categoryCreate;
          const requester =  ReqHelper.getRequester(res)
          const r = await this.service.create(requester,body)

          r.match(
              value => {
                  res.status(200).send(AppResponse.SimpleResponse(true))
              },
              e => {
                  writeErrorResponse(res,e)
              }
          )
      }
    }

    delete() : express.Handler {
        return async (req, res, next) => {
            const id = parseInt(req.params.id);

            if (!id) {
                res.status(400).send(AppResponse.ErrorResponse(createInvalidDataError(new Error("id must a number"))))
                return
            }
            const requester =  ReqHelper.getRequester(res)
            const r = await this.service.delete(requester,id)

            r.match(
                value => {
                    res.status(200).send(AppResponse.SimpleResponse(true))
                },
                e => {
                    writeErrorResponse(res,e)
                }
            )
        }
    }

    update() : express.Handler {
        return async (req, res, next) => {
            const body = req.body as categoryUpdate;
            const id = parseInt(req.params.id);

            if (!id) {
                res.status(400).send(AppResponse.ErrorResponse(createInvalidDataError(new Error("id must a number"))))
                return
            }

            const requester =  ReqHelper.getRequester(res)
            const r = await this.service.update(requester,id,body)

            r.match(
                value => {
                    res.status(200).send(AppResponse.SimpleResponse(true))
                },
                e => {
                    writeErrorResponse(res,e)
                }
            )
        }
    }

    list() : express.Handler {
        return async (req, res, next) => {
            const paging = ReqHelper.getPaging(req.query)


            const r = await this.service.list({},paging)

            r.match(
                value => {
                    res.status(200).send(AppResponse.SuccessResponse(value,paging,{}))
                },
                e => {
                    writeErrorResponse(res,e)
                }
            )
        }
    }

    getById() : express.Handler {
        return async (req, res, next) => {
            const id = parseInt(req.params.id);

            if (!id) {
                res.status(400).send(AppResponse.ErrorResponse(createInvalidDataError(new Error("id must a number"))))
                return
            }

            const r = await this.service.findById(id)

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