import { InventoryReportCreate, InventoryReport } from "../entity/inventoryReport";
import { ResultAsync } from "neverthrow";
import { Err } from "../../../libs/errors";
import { ICondition } from "../../../libs/condition";
import { Paging } from "../../../libs/paging";
import { InventoryReportDetailTable } from "../entity/inventoryReportDetailTable";
import {InventoryReportTable} from "../entity/inventoryReportTable";

export interface IInventoryReportService {
    createReport(report: InventoryReportCreate): ResultAsync<number, Err>
    listReports(cond: ICondition, paging: Paging): ResultAsync<InventoryReport[], Err>
    getReportById(id: number): ResultAsync<InventoryReport | null, Err>
    updateReport(id: number, report: Partial<InventoryReport>): ResultAsync<void, Err>
    deleteReport(id: number): ResultAsync<void, Err>
    getInventoryReportDetails(reportId: number): ResultAsync<InventoryReportDetailTable, Err>
    getInventoryReportsTable(condition: ICondition, paging: Paging): ResultAsync<InventoryReportTable[], Err>
}

