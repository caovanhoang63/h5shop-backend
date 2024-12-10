import { InventoryReportCreate, InventoryReport } from "../entity/inventoryReport";
import { ResultAsync } from "neverthrow";
import { Err } from "../../../libs/errors";
import { ICondition } from "../../../libs/condition";
import { Paging } from "../../../libs/paging";
import { IBaseRepo } from "../../../libs/IBaseRepo";

export interface IInventoryReportRepository extends IBaseRepo {
    create: (report: InventoryReportCreate) => ResultAsync<number, Err>
    findByCondition: (condition: ICondition, paging: Paging) => ResultAsync<InventoryReport[], Err>
    findById: (id: number) => ResultAsync<InventoryReport | null, Err>
    update: (id: number, report: Partial<InventoryReport>) => ResultAsync<void, Err>
    hardDeleteById: (id: number) => ResultAsync<void, Err>
}