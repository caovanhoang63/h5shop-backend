import { ResultSetHeader, RowDataPacket } from "mysql2";
import { InventoryReportDetailCreate, InventoryReportDetail } from "../../entity/inventoryReportDetail";
import { ICondition } from "../../../../libs/condition";
import { SqlHelper } from "../../../../libs/sqlHelper";
import { Paging } from "../../../../libs/paging";
import { err, ok, ResultAsync } from "neverthrow";
import { Err } from "../../../../libs/errors";
import { IInventoryReportDetailRepository } from "../IInventoryReportDetailRepository";
import { BaseMysqlRepo } from "../../../../components/mysql/BaseMysqlRepo";

export class InventoryReportDetailMysqlRepo extends BaseMysqlRepo implements IInventoryReportDetailRepository {

    public create = (detail: InventoryReportDetailCreate): ResultAsync<void, Err> => {
        const query = `INSERT INTO inventory_report_detail (inventory_report_id, sku_id, amount, inventory_dif)
                       VALUES (?, ?, ?, ?, ?, ?, ?)`;

        return this.executeQuery(query,
            [detail.inventoryReportId, detail.skuId, detail.amount, detail.inventoryDif],
        ).andThen(
            ([r, f]) => {
                return ok(undefined)
            })
    }

    public findByReportId = (reportId: number): ResultAsync<InventoryReportDetail[], Err> => {
        const query = `SELECT * FROM inventory_report_detail WHERE inventory_report_id = ?`;
        return this.executeQuery(query, [reportId])
            .andThen(([r, f]) => {
                const rows = r as RowDataPacket[]
                const data: InventoryReportDetail[] = rows.map(row => SqlHelper.toCamelCase(row) as InventoryReportDetail);
                return ok(data)
            })
    }

    public update = (id: number, detail: Partial<InventoryReportDetail>): ResultAsync<void, Err> => {
        const [setClauses, values] = SqlHelper.buildUpdateClause(detail);
        const query = `UPDATE inventory_report_detail SET ${setClauses} WHERE id = ?`;
        return this.executeQuery(query, [...values, id]).andThen(([r, f]) => {
            return ok(undefined)
        })
    }

    public hardDeleteById = (id: number): ResultAsync<void, Err> => {
        const query = `DELETE FROM inventory_report_detail WHERE id = ?`;
        return this.executeQuery(query, [id]).andThen(([r, f]) => {
            return ok(undefined)
        })
    }

    public findByCondition = (cond: ICondition, paging: Paging): ResultAsync<InventoryReportDetail[], Err> => {
        const [whereClause, values] = SqlHelper.buildWhereClause(cond)
        const query = `SELECT * FROM inventory_report_detail ${whereClause}`;

        return this.executeQuery(query, values).andThen(
            ([r, f]) => {
                const rows = r as RowDataPacket[]
                const data: InventoryReportDetail[] = rows.map(row => SqlHelper.toCamelCase(row) as InventoryReportDetail);
                paging.total = rows.length;
                return ok(data)
            })
    }
}

