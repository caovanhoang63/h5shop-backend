import { InventoryReportDetailCreate, InventoryReportDetail } from "../entity/inventoryReportDetail";
import { ResultAsync } from "neverthrow";
import { Err } from "../../../libs/errors";
import { ICondition } from "../../../libs/condition";
import { Paging } from "../../../libs/paging";
import { IBaseRepo } from "../../../libs/IBaseRepo";

export interface IInventoryReportDetailRepository extends IBaseRepo {
    create: (detail: InventoryReportDetailCreate) => ResultAsync<void, Err>
    findByCondition: (condition: ICondition, paging: Paging) => ResultAsync<InventoryReportDetail[], Err>
    findByReportId: (reportId: number) => ResultAsync<InventoryReportDetail[], Err>
    update: (id: number, detail: Partial<InventoryReportDetail>) => ResultAsync<void, Err>
    hardDeleteById: (id: number) => ResultAsync<void, Err>
}

