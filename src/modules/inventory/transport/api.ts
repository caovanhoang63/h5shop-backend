import express from "express";
import { InventoryReportCreate } from "../entity/inventoryReport";
import { AppResponse } from "../../../libs/response";
import { writeErrorResponse } from "../../../libs/writeErrorResponse";
import { IInventoryReportService } from "../service/IInventoryReportService";
import { ReqHelper } from "../../../libs/reqHelper";

export class InventoryReportApi {
    private readonly inventoryReportService: IInventoryReportService;

    constructor(service: IInventoryReportService) {
        this.inventoryReportService = service;
    }

    public createReport: express.Handler = async (req, res, next) => {
        const data: InventoryReportCreate = req.body;
        const result = await this.inventoryReportService.createReport(data);
        if (result.isErr()) {
            writeErrorResponse(res, result.error)
            return
        }
        res.send(AppResponse.SimpleResponse(result.value))
    }

    public listReports: express.Handler = async (req, res, next) => {
        const paging = ReqHelper.getPaging(req.query);
        //const cond = ReqHelper.getCondition(req.query);
        const cond = {}
        const result = await this.inventoryReportService.listReports(cond, paging)
        if (result.isErr()) {
            writeErrorResponse(res, result.error)
            return
        }
        res.send(AppResponse.SuccessResponse(result.value, paging, cond))
    }

    public getReportById: express.Handler = async (req, res, next) => {
        const id = parseInt(req.params.id);
        const result = await this.inventoryReportService.getReportById(id);
        if (result.isErr()) {
            writeErrorResponse(res, result.error)
            return
        }
        res.send(AppResponse.SimpleResponse(result.value))
    }

    public updateReport: express.Handler = async (req, res, next) => {
        const id = parseInt(req.params.id);
        const data = req.body;
        const result = await this.inventoryReportService.updateReport(id, data);
        if (result.isErr()) {
            writeErrorResponse(res, result.error)
            return
        }
        res.send(AppResponse.SimpleResponse(true))
    }

    public deleteReport: express.Handler = async (req, res, next) => {
        const id = parseInt(req.params.id);
        const result = await this.inventoryReportService.deleteReport(id);
        if (result.isErr()) {
            writeErrorResponse(res, result.error)
            return
        }
        res.send(AppResponse.SimpleResponse(true))
    }
}

