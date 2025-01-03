import {IReportService} from "./IReportService";
import {inject, injectable} from "inversify";
import {TYPES} from "../../../types";
import {IReportRepo} from "../repository/IReportRepo";
import { ResultAsync } from "neverthrow";
import { Revenue } from "../entity/revenue";
import {createInternalError} from "../../../libs/errors";
import { SkuOrder } from "../entity/skuOrder";

@injectable()
export class ReportService implements IReportService {
    constructor(@inject(TYPES.IReportRepository) private readonly reportRepo: IReportRepo) {
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

}