import {inject, injectable} from "inversify";
import {SettingService} from "../service/settingService";
import {ISettingService} from "../service/ISettingService";
import {TYPES} from "../../../types";
import express from "express";
import {SettingCreate, SettingUpdate} from "../entity/setting";
import {ReqHelper} from "../../../libs/reqHelper";
import {AppResponse} from "../../../libs/response";
import {writeErrorResponse} from "../../../libs/writeErrorResponse";

@injectable()
export default class SettingApi {
    constructor(@inject(TYPES.ISettingService) private readonly settingService: ISettingService) {}

    create() :express.Handler {
        return async (req: express.Request, res: express.Response) => {
            const body = req.body as SettingCreate;
            const requester = ReqHelper.getRequester(res);


            (await this.settingService.create(requester,body)).match(
                r=>{
                    res.status(200).send(AppResponse.SimpleResponse(body.id))
                },
                e=> {
                    writeErrorResponse(res,e)
                }
            )
        }
    }

    update() :express.Handler {
        return async (req: express.Request, res: express.Response) => {
            const name = req.params.name;
            const body = req.body as SettingUpdate;
            const requester = ReqHelper.getRequester(res);


            (await this.settingService.update(requester,name,body)).match(
                r=>{
                    res.status(200).send(AppResponse.SimpleResponse(true))
                },
                e=> {
                    writeErrorResponse(res,e)
                }
            )
        }
    }

    delete( ):express.Handler {
        return async (req: express.Request, res: express.Response) => {
            const name = req.params.name;
            const requester = ReqHelper.getRequester(res);
            (await this.settingService.delete(requester,name)).match(
                r=>{
                    res.status(200).send(AppResponse.SimpleResponse(true))
                },
                e=> {
                    writeErrorResponse(res,e)
                }
            )
        }
    }
    findByName() : express.Handler {
            return async (req: express.Request, res: express.Response) => {
                const name = req.params.name;
                (await this.settingService.findByName(name)).match(
                    r=>{
                        res.status(200).send(AppResponse.SimpleResponse(r))
                    },
                    e=> {
                        writeErrorResponse(res,e)
                    }
                )
        }
    }
    find() :express.Handler {
        return async (req: express.Request, res: express.Response) => {}
    }
}