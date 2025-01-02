import {IReportService} from "./IReportService";
import {inject, injectable} from "inversify";
import {TYPES} from "../../../types";
import {IReportRepo} from "../repository/IReportRepo";
import { ResultAsync } from "neverthrow";
import { Revenue } from "../entity/revenue";
import {createInternalError} from "../../../libs/errors";

@injectable()
export class ReportService implements IReportService {
    constructor(@inject(TYPES.IReportRepository) private readonly reportRepo: IReportRepo) {
    }

    totalOrder(startDate: Date, endDate: Date): ResultAsync<number, Error> {
        return this.reportRepo.totalOrder(startDate, endDate);
    }

    revenue(startDate: Date, endDate: Date): ResultAsync<Revenue[], Error> {
        return this.reportRepo.revenue(startDate, endDate);
    }

}