import express from "express";
import {container} from "../../container";
import {ReportApi} from "../../modules/report/transport/reportApi";
import {TYPES} from "../../types";
import authentication from "../../middlewares/authentication";


const reportRoute = () => {
    const router = express.Router();
    const reportService = container.get<ReportApi>(TYPES.IReportController)
    router.use(authentication())
    router.get("/revenue", reportService.revenue())
    router.get("/total-order", reportService.totalOrder())
    router.get("/sku-order", reportService.skuOrder())
    router.get("/sale",reportService.sale())
    router.get("/inventory",reportService.inventory())
    router.get("/category",reportService.category())
    router.get("/revenue-and-expenditure",reportService.revenueAndExpenditure())
    return router;
}

export default reportRoute ;