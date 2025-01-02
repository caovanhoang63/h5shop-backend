import {inject, injectable} from "inversify";
import {IWarrantyService} from "../service/IWarrantyService";
import {TYPES} from "../../../types";
import express from "express";
import {AppResponse} from "../../../libs/response";
import {createInvalidDataError} from "../../../libs/errors";
import {writeErrorResponse} from "../../../libs/writeErrorResponse";
import {ReqHelper} from "../../../libs/reqHelper";
import {WarrantyFilter} from "../entity/filter";
import {WarrantyFormCreate} from "../entity/warrantyFormCreate";

@injectable()
export class WarrantyApi {
    constructor(@inject(TYPES.IWarrantyService) private warrantyService: IWarrantyService) {}
    findById(): express.Handler {
        return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
            const id = parseInt(req.params.id);

            if(!id){
                res.status(400).send(AppResponse.ErrorResponse(createInvalidDataError(new Error("id must a number"))))
                return
            }

            (await this.warrantyService.findById(id)).match(
                value => {
                    res.status(200).send(AppResponse.SimpleResponse(value))
                },
                e => {
                    writeErrorResponse(res,e)
                }
            )
        }
    }

    list() : express.Handler {
        return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
            const filter  = {
                status : req.query.status,
                lkCustomerPhoneNumber : req.query.lkCustomerPhoneNumber,
                gtCreatedAt : req.query.gtCreatedAt,
                ltCreatedAt : req.query.ltCreatedAt,
                gtUpdatedAt : req.query.gtUpdatedAt,
                ltUpdatedAt : req.query.ltUpdatedAt
            } as WarrantyFilter;

            const paging = ReqHelper.getPaging(req.query)

            const r = await this.warrantyService.findMany(filter,paging)
            r.match(
                value => {
                    res.status(200).send(AppResponse.SuccessResponse(value,paging,filter))
                },
                e => {
                    writeErrorResponse(res,e)
                }
            )
        }
    }

    create() : express.Handler {
        return  async  (req: express.Request, res: express.Response, next: express.NextFunction) => {
            const body = req.body as WarrantyFormCreate;
            const requester = ReqHelper.getRequester(res)
            const r = await this.warrantyService.create(requester,body)
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

}