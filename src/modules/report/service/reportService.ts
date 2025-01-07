import {IReportService} from "./IReportService";
import {inject, injectable} from "inversify";
import {TYPES} from "../../../types";
import {IReportRepo} from "../repository/IReportRepo";
import { ResultAsync } from "neverthrow";
import { Revenue } from "../entity/revenue";
import {createInternalError, Err} from "../../../libs/errors";
import { SkuOrder } from "../entity/skuOrder";
import { Sale } from "../entity/sale";
import {SkuWarningStock} from "../../catalog/sku/entity/skuWarningStock";
import {ISkuRepository} from "../../catalog/sku/repository/ISkuRepository";
import {SkuStock} from "../entity/skuStock";
import { Category } from "../entity/category";
import { RevenueAndExpenditure } from "../entity/revenueAndExpenditure";

@injectable()
export class ReportService implements IReportService {
    constructor(@inject(TYPES.IReportRepository) private readonly reportRepo: IReportRepo) {
    }

    revenueAndExpenditure(startDate: Date, endDate: Date): ResultAsync<RevenueAndExpenditure[], Error> {
        return this.reportRepo.revenueAndExpenditure(startDate, endDate);
    }

    category(startDate: Date, endDate: Date): ResultAsync<Category[], Error> {
        return this.reportRepo.category(startDate, endDate)
    }
    sale(startDate: Date, endDate: Date): ResultAsync<Sale[], Error> {
        return this.reportRepo.sale(startDate, endDate);
    }

    skuOrder(startDate: Date, endDate: Date,limit : number, order: string): ResultAsync<SkuOrder[], Error> {
        return this.reportRepo.skuOrder(startDate, endDate,limit, order);
    }

    totalOrder(startDate: Date, endDate: Date): ResultAsync<number, Error> {
        return this.reportRepo.totalOrder(startDate, endDate);
    }

    revenue(startDate: Date, endDate: Date): ResultAsync<Revenue[], Error> {
        return this.reportRepo.revenue(startDate, endDate);
    }
    inventory(gtStock : number,ltStock: number) :  ResultAsync<SkuStock[], Error>{
        return this.reportRepo.inventory(gtStock, ltStock);
    }
}