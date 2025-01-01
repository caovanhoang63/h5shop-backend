import {inject, injectable} from "inversify";
import {err, ok, ResultAsync} from "neverthrow";
import { ICondition } from "../../../../libs/condition";
import {createInternalError, Err} from "../../../../libs/errors";
import { Paging } from "../../../../libs/paging";
import { StockInDetailTable } from "../entity/stockInDetailTable";
import { StockInTable } from "../entity/stockInTable";
import {IStockInService} from "./IStockInService";
import {TYPES} from "../../../../types";
import {IInventoryReportRepository} from "../../../inventory/repository/IInventoryReportRepository";
import {IStockInRepository} from "../repository/IStockInRepository";
import {InventoryReportCreate, inventoryReportCreateSchema} from "../../../inventory/entity/inventoryReport";
import {Validator} from "../../../../libs/validator";
import {StockInCreate, stockInCreateSchema} from "../entity/stockIn";

@injectable()
export class StockInService implements IStockInService {
    constructor(@inject(TYPES.IStockInRepository) private readonly stockInRepository: IStockInRepository) {}

    getStockInDetails(reportId: number): ResultAsync<StockInDetailTable | null, Err> {
        return this.stockInRepository.getStockInDetails(reportId);
    }
    getStockInTable(condition: ICondition, paging: Paging): ResultAsync<StockInTable[] | null, Err> {
        return ResultAsync.fromPromise(
            (async () =>{
                const result = await this.stockInRepository.getStockInTable(condition, paging);
                if (result.isErr())
                    return err(result.error)
                return ok(result.value)
            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }
    public createReport = (report: StockInCreate): ResultAsync<number | null, Err> => {
        return ResultAsync.fromPromise(
            (async () => {
                const vR = (await Validator(stockInCreateSchema, report))
                if (vR.isErr()) {
                    return err(vR.error);
                }
                const r = await this.stockInRepository.create(report);
                if (r.isErr()) {
                    return err(r.error);
                }
                return ok(r.value);
            })(), e => e as Err
        ).andThen(r => r)
    }

}