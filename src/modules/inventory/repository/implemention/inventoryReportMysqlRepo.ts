import { ResultSetHeader, RowDataPacket } from "mysql2";
import { InventoryReportCreate, InventoryReport } from "../../entity/inventoryReport";
import { ICondition } from "../../../../libs/condition";
import { SqlHelper } from "../../../../libs/sqlHelper";
import { Paging } from "../../../../libs/paging";
import { err, ok, ResultAsync } from "neverthrow";
import { Err } from "../../../../libs/errors";
import { IInventoryReportRepository } from "../IInventoryReportRepository";
import { BaseMysqlRepo } from "../../../../components/mysql/BaseMysqlRepo";
import { InventoryReportDetailTable } from "../../entity/inventoryReportDetailTable";
import {Category} from "../../../catalog/category/entity/category";
import {InventoryReportTable} from "../../entity/inventoryReportTable";

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

    public getInventoryReportDetails = (reportId: number): ResultAsync<InventoryReportDetailTable, Err> => {
        const query = `
            SELECT
                ird.id as inventoryReportId,
                s.id as skuId,
                spu.name as spuName, 
                ird.amount,
                ir.warehouse_man_1 as warehouseMan,
                u.last_name as warehouseName,
                ird.status,
                ird.inventory_dif as inventoryDif,
                ird.note,
                ird.created_at as createdAt,
                ir.updated_at as updatedAt
            FROM
                inventory_report_detail ird
                    JOIN inventory_report ir ON ird.inventory_report_id = ir.id
                    JOIN sku s ON ird.sku_id = s.id
                    JOIN spu spu ON s.spu_id = spu.id  
                    JOIN user u ON ir.warehouse_man_1 = u.id
            WHERE
                ird.inventory_report_id = ?
        `;

        return this.executeQuery(query, [reportId]).andThen(
            ([r, f]) => {
                const rows = r as RowDataPacket[];

                const groupedResults: InventoryReportDetailTable = {
                    inventoryReportId: reportId,
                    amount: 0,  // Initialize with a default value
                    warehouseMan: 0, // Initialize with a default value
                    warehouseName:"",
                    status: 1,  // Default status if no specific status is found
                    items: [],
                    note: "",
                    createdAt: null,
                    updatedAt: null,
                };

                rows.forEach(row => {
                    groupedResults.amount += row.amount;
                    groupedResults.warehouseMan = row.warehouseMan;
                    groupedResults.warehouseName = row.warehouseName;
                    groupedResults.status = row.status;
                    groupedResults.note = row.note || groupedResults.note;
                    groupedResults.createdAt = row.createdAt || groupedResults.createdAt;
                    groupedResults.updatedAt = row.updatedAt || groupedResults.updatedAt;

                    groupedResults.items.push({
                        skuId: row.skuId,
                        name: row.spuName,
                        amount: row.amount,
                        inventoryDif: row.inventoryDif,
                    });
                });

                // Return the structured data.
                return ok(groupedResults);
            }
        );
    };

    public getInventoryReportsTable = (condition: ICondition, paging: Paging): ResultAsync<InventoryReportTable[], Err> => {
        const [whereClause, whereValues] = SqlHelper.buildWhereClause(condition);
        const pagingClause = SqlHelper.buildPaginationClause(paging)
        const query = `
            SELECT
                ir.id,
                ird.amount,
                ir.warehouse_man_1 as warehouseMan,
                ir.status,
                ird.inventory_dif as inventoryDif,
                ird.note,
                ir.created_at as createdAt,
                ir.updated_at as updatedAt
            FROM
                inventory_report ir
                    JOIN
                inventory_report_detail ird ON ir.id = ird.inventory_report_id
                    JOIN
                sku s ON ird.sku_id = s.id
                ${whereClause}
            ${pagingClause}
        `;

        const countQuery = `
            SELECT COUNT(*) as total
            FROM inventory_report ir
                     JOIN inventory_report_detail ird ON ir.id = ird.inventory_report_id
                ${whereClause}
        `;

        return this.executeQuery(countQuery, whereValues)
            .andThen(([countResult, _]) => {
                const firstRow = (countResult as RowDataPacket[])[0];
                if (!firstRow) {
                    return ok({total: 0});
                }
                paging.total = firstRow.total
                return ok({total: firstRow.total});
            })
            .andThen(
                (r) => {
                    if (r.total == 0)
                        return ok([])
                    else
                        return this.executeQuery(
                            query,whereValues
                        ).andThen(
                            ([r, f]) => {
                                const data = (r as RowDataPacket[]).map(row => SqlHelper.toCamelCase(row) as InventoryReportTable);
                                return ok(data)
                            }
                        )
                });
    }
}

