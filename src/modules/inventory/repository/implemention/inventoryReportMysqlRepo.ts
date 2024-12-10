import { ResultSetHeader, RowDataPacket } from "mysql2";
import { InventoryReportCreate, InventoryReport } from "../../entity/inventoryReport";
import { ICondition } from "../../../../libs/condition";
import { SqlHelper } from "../../../../libs/sqlHelper";
import { Paging } from "../../../../libs/paging";
import { err, ok, ResultAsync } from "neverthrow";
import { Err } from "../../../../libs/errors";
import { IInventoryReportRepository } from "../IInventoryReportRepository";
import { BaseMysqlRepo } from "../../../../components/mysql/BaseMysqlRepo";

export class InventoryReportMysqlRepo extends BaseMysqlRepo implements IInventoryReportRepository {

    public create = (report: InventoryReportCreate): ResultAsync<number, Err> => {
        const query = `INSERT INTO inventory_report (warehouse_man_1, warehouse_man_2, warehouse_man_3, status)
                       VALUES (?, ?, ?, ?)`;

        return this.executeQuery(query,
            [report.warehouseMan1, report.warehouseMan2, report.warehouseMan3, report.status],
        ).andThen(
            ([r, f]) => {
                const header = r as ResultSetHeader
                return ok(header.insertId)
            })
    }

    public findById = (id: number): ResultAsync<InventoryReport | null, Err> => {
        const query = `SELECT * FROM inventory_report WHERE id = ? LIMIT 1`;
        return this.executeQuery(query, [id])
            .andThen(([r, f]) => {
                const a = r as RowDataPacket[]
                if (a.length <= 0) {
                    return ok(null)
                }
                const data: InventoryReport = SqlHelper.toCamelCase(a[0]);
                return ok(data)
            })
    }

    public update = (id: number, report: Partial<InventoryReport>): ResultAsync<void, Err> => {
        const [setClauses, values] = SqlHelper.buildUpdateClause(report);
        const query = `UPDATE inventory_report SET ${setClauses} WHERE id = ?`;
        return this.executeQuery(query, [...values, id]).andThen(([r, f]) => {
            return ok(undefined)
        })
    }

    public hardDeleteById = (id: number): ResultAsync<void, Err> => {
        const query = `DELETE FROM inventory_report WHERE id = ?`;
        return this.executeQuery(query, [id]).andThen(([r, f]) => {
            return ok(undefined)
        })
    }

    public findByCondition = (cond: ICondition, paging: Paging): ResultAsync<InventoryReport[], Err> => {
        const [whereClause, values] = SqlHelper.buildWhereClause(cond)
        const query = `SELECT * FROM inventory_report ${whereClause}`;

        return this.executeQuery(query, values).andThen(
            ([r, f]) => {
                const rows = r as RowDataPacket[]
                const data: InventoryReport[] = rows.map(row => SqlHelper.toCamelCase(row) as InventoryReport);
                paging.total = rows.length;
                return ok(data)
            })
    }
}

