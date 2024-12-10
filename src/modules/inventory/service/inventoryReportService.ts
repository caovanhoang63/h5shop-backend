import { InventoryReportCreate, inventoryReportCreateSchema, InventoryReport } from "../entity/inventoryReport";
import { createEntityNotFoundError, Err } from "../../../libs/errors";
import { Paging } from "../../../libs/paging";
import { Validator } from "../../../libs/validator";
import { err, ok, ResultAsync } from "neverthrow";
import { IInventoryReportRepository } from "../repository/IInventoryReportRepository";
import { IInventoryReportService } from "./IInventoryReportService";
import { ICondition } from "../../../libs/condition";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types";

@injectable()
export class InventoryReportService implements IInventoryReportService {
    constructor(@inject(TYPES.IInventoryReportRepository) private readonly inventoryReportRepository: IInventoryReportRepository) {}

    public createReport = (report: InventoryReportCreate): ResultAsync<number, Err> => {
        return ResultAsync.fromPromise(
            (async () => {
                const vR = (await Validator(inventoryReportCreateSchema, report))
                if (vR.isErr()) {
                    return err(vR.error);
                }

                const r = await this.inventoryReportRepository.create(report);
                if (r.isErr()) {
                    return err(r.error);
                }
                return ok(r.value);
            })(), e => e as Err
        ).andThen(r => r)
    }

    public listReports = (cond: ICondition, paging: Paging): ResultAsync<InventoryReport[], Err> => {
        return this.inventoryReportRepository.findByCondition(cond, paging)
    }

    public getReportById = (id: number): ResultAsync<InventoryReport | null, Err> => {
        return this.inventoryReportRepository.findById(id)
    }

    public updateReport = (id: number, report: Partial<InventoryReport>): ResultAsync<void, Err> => {
        return this.inventoryReportRepository.update(id, report)
    }

    public deleteReport = (id: number): ResultAsync<void, Err> => {
        return this.inventoryReportRepository.hardDeleteById(id)
    }
}

