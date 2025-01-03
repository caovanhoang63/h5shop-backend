import { InventoryReportCreate, InventoryReport } from "../entity/inventoryReport";
import { ResultAsync } from "neverthrow";
import { Err } from "../../../libs/errors";
import { ICondition } from "../../../libs/condition";
import { Paging } from "../../../libs/paging";
import { IBaseRepo } from "../../../libs/IBaseRepo";
import { InventoryReportDetailTable } from "../entity/inventoryReportDetailTable";
import {InventoryReportTable} from "../entity/inventoryReportTable";

export interface IInventoryReportRepository extends IBaseRepo {
    create: (report: InventoryReportCreate) => ResultAsync<number, Err>
    findById: (reportId: number) => ResultAsync<InventoryReportDetailTable | null, Err>
    list: (condition: ICondition, paging: Paging) => ResultAsync<InventoryReportTable[] | null, Err>
}

