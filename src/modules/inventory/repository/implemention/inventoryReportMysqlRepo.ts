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
        const query = `INSERT INTO inventory_report (warehouse_man_1, warehouse_man_2, warehouse_man_3, note)
                       VALUES (?, ?, ?, ?)`;


        const detailQuery = `INSERT INTO inventory_report_detail (inventory_report_id, sku_id, amount,old_stock, inventory_dif)
                        VALUES ?`
        const skuQuery = `UPDATE sku SET stock = CASE
                            ${report.items.map(r => `WHEN id = ? THEN stock + ?`).join(' ')}
                            END
                          WHERE id IN (${report.items.map(()=> '?').join(',')})`;
        const skuValue = report.items.map(r =>[r.skuId,r.inventoryDif]).flat();
        const ids = report.items.map(r => r.skuId)

        const headerValues = [
            report.warehouseMan1,
            report.warehouseMan2,
            report.warehouseMan3,
            report.note
        ];
        return this.executeInTransaction<number>(conn =>
            this.executeQuery(query, headerValues)
                .andThen(([headerResult, _]) => {
                    const header = headerResult as ResultSetHeader;
                    const insertId = header.insertId;

                    const detailValuesWithInsertId = report.items.map(item => [
                        insertId,
                        item.skuId,
                        item.amount,
                        item.oldStock,
                        item.inventoryDif
                    ]);

                    return this.executeQuery(detailQuery, [detailValuesWithInsertId])
                        .andThen(()=>
                            this.executeQuery(skuQuery, [...skuValue,...ids])
                        )
                        .map(() => insertId);
                })
        );
    }

    public findById = (reportId: number): ResultAsync<InventoryReportDetailTable | null, Err> => {
        const query = `
            SELECT
                ird.id as inventoryReportId,
                s.id as skuId,
                spu.name as spuName, 
                ird.amount,
                ir.warehouse_man_1 as warehouseMan,
                u.last_name as warehouseName,
                ird.old_stock as oldStock,
                ird.status,
                ird.inventory_dif as inventoryDif,
                ir.note,
                s.price,
                ird.created_at as createdAt,
                ir.updated_at as updatedAt
            FROM
                inventory_report_detail ird
                    JOIN inventory_report ir ON ird.inventory_report_id = ir.id
                    JOIN sku s ON ird.sku_id = s.id
                    JOIN spu spu ON s.spu_id = spu.id  
                    LEFT JOIN user u ON ir.warehouse_man_1 = u.id
            WHERE
                ird.inventory_report_id = ?
        `;

        return this.executeQuery(query, [reportId]).andThen(
            ([r, f]) => {
                const rows = r as RowDataPacket[];

                if (!rows.length) {
                    return ok(null);
                }
                const groupedResults: InventoryReportDetailTable = {
                    inventoryReportId: reportId,
                    amount: 0,
                    warehouseMan: 0,
                    warehouseName:"",
                    status: 1,
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
                        oldStock : row.oldStock,
                        price: row.price,
                        amount: row.amount,
                        inventoryDif: row.inventoryDif,
                    });
                });

                // Return the structured data.
                return ok(groupedResults);
            }
        );
    };

    public list = (condition: ICondition, paging: Paging): ResultAsync<InventoryReportTable[], Err> => {
        const pagingClause = SqlHelper.buildPaginationClause(paging)
        const [whereClause, whereValues] = SqlHelper.buildWhereClause(condition,"ir");
        const query = `
            SELECT
                ir.id,
                SUM(ird.amount) AS amount,
                ir.warehouse_man_1 AS warehouseMan,
                ir.status,
                SUM(ird.inventory_dif) AS inventoryDif,
                ir.note,
                ir.created_at AS createdAt,
                ir.updated_at AS updatedAt
            FROM
                inventory_report ir
                    JOIN inventory_report_detail ird ON ir.id = ird.inventory_report_id
                    JOIN sku s ON ird.sku_id = s.id
                ${whereClause}
            GROUP BY ir.id
                ${pagingClause}
        `;

        const countQuery = `
            SELECT COUNT(DISTINCT ir.id) AS total
            FROM inventory_report ir
                     JOIN inventory_report_detail ird ON ir.id = ird.inventory_report_id
                ${whereClause}
        `;

        return this.executeQuery(countQuery, whereValues)
            .andThen(([countResult, _]) => {
                const firstRow = (countResult as RowDataPacket[])[0];
                if (!firstRow) {
                    return ok({ total: 0 });
                }
                paging.total = firstRow.total;
                return ok({ total: firstRow.total });
            })
            .andThen(
                (r) => {
                    if (r.total === 0) {
                        return ok([]);
                    } else {
                        return this.executeQuery(query, whereValues)
                            .andThen(([queryResult, _]) => {
                                const data = (queryResult as RowDataPacket[]).map(row => SqlHelper.toCamelCase(row) as InventoryReportTable);
                                return ok(data);
                            });
                    }
                }
            );
    }
}

