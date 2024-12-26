import {IUploadService} from "../service/IUploadService";
import express from "express";
import {AppResponse} from "../../../libs/response";
import {writeErrorResponse} from "../../../libs/writeErrorResponse";

export class UploadApi {
    constructor(private readonly service : IUploadService) {}


    uploadImage() : express.Handler {
        return async (req, res, next) => {
            const file = req.file

            if(!file){
                writeErrorResponse(res, "File not found")
                return
            }

            const r = await this.service.uploadImage(file)

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