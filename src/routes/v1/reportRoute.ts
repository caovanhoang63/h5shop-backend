import express from "express";
import {container} from "../../container";
import {ReportApi} from "../../modules/report/transport/reportApi";
import {TYPES} from "../../types";


const reportRoute = () => {
    const router = express.Router();
    const reportService = container.get<ReportApi>(TYPES.IReportController)
    router.get("/revenue", reportService.revenue())
    router.get("/total-order", reportService.totalOrder())
    router.get("/sku-order", reportService.skuOrder())
    router.get("/sale",reportService.sale())
    return router;
}

export default reportRoute ;