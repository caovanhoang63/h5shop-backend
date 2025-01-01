import {BaseMysqlRepo} from "../../../../components/mysql/BaseMysqlRepo";
import {IStockInRepository} from "./IStockInRepository";
import {ok, ResultAsync} from "neverthrow";
import {StockInDetailCreate} from "../entity/stockInDetail";
import {ICondition} from "../../../../libs/condition";
import {Paging} from "../../../../libs/paging";
import {StockInTable} from "../entity/stockInTable";
import {Err} from "../../../../libs/errors";
import {SqlHelper} from "../../../../libs/sqlHelper";
import {ResultSetHeader, RowDataPacket} from "mysql2";
import {InventoryReportTable} from "../../../inventory/entity/inventoryReportTable";
import {StockInDetailTable} from "../entity/stockInDetailTable";
import {InventoryReportDetailTable} from "../../../inventory/entity/inventoryReportDetailTable";
import {StockInCreate} from "../entity/stockIn";
import {query} from "express";

export class StockInRepository extends BaseMysqlRepo implements IStockInRepository {
    findById(reportId: number): ResultAsync<StockInDetailTable | null, Err> {
        const query = `
            SELECT
                std.id as id,
                s.id as skuId,
                std.cost_price as costPrice,    
                spu.name as spuName, 
                std.amount,
                st.warehouse_men as warehouseMan,
                u.last_name as warehouseName,
                std.status,
                std.created_at as createdAt,
                st.updated_at as updatedAt
            FROM
                stock_in_detail std
                    JOIN stock_in st ON std.stock_in_id = st.id
                    JOIN sku s ON std.sku_id = s.id
                    JOIN spu spu ON s.spu_id = spu.id  
                    JOIN user u ON st.warehouse_men = u.id
            WHERE
                std.stock_in_id = ?
        `;

        return this.executeQuery(query, [reportId]).andThen(
            ([r, f]) => {
                const rows = r as RowDataPacket[];

                const groupedResults: StockInDetailTable = {
                    id: reportId,
                    providerId: 0,
                    providerName:"",
                    warehouseMen: 0,
                    warehouseName:"",
                    totalAmount:0,
                    status: 1,
                    items: [],
                    createdAt: null,
                    updatedAt: null,
                };

                rows.forEach(row => {
                    groupedResults.totalAmount += row.amount;
                    groupedResults.providerId = row.providerId;
                    groupedResults.providerName = row.providerName;
                    groupedResults.warehouseMen = row.warehouseMan;
                    groupedResults.warehouseName = row.warehouseName;
                    groupedResults.status = row.status;
                    groupedResults.createdAt = row.createdAt || groupedResults.createdAt;
                    groupedResults.updatedAt = row.updatedAt || groupedResults.updatedAt;

                    groupedResults.items.push({
                        skuId: row.skuId,
                        name: row.spuName,
                        amount: row.amount,
                        price: row.costPrice
                    });
                });

                // Return the structured data.
                return ok(groupedResults);
            }
        );
    }

    list(condition: ICondition, paging: Paging): ResultAsync<StockInTable[] | null, Err> {
        const pagingClause = SqlHelper.buildPaginationClause(paging)
        const [whereClause, whereValues] = SqlHelper.buildWhereClause(condition,"st");
        const query = `
            SELECT
                st.id,
                st.provider_id AS providerId,
                p.name AS providerName,
                SUM(std.amount) AS totalAmount,
                st.warehouse_men AS warehouseMen,
                st.status,
                st.created_at AS createdAt,
                st.updated_at AS updatedAt
            FROM
                stock_in st
                    JOIN stock_in_detail std ON st.id = std.stock_in_id
                    JOIN sku s ON std.sku_id = s.id
                    JOIN provider p on st.provider_id = p.id
                ${whereClause}
            GROUP BY st.id
                ${pagingClause}
        `;

        const countQuery = `
            SELECT COUNT(DISTINCT st.id) AS total
            FROM stock_in st
                     JOIN stock_in_detail std ON st.id = std.stock_in_id
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
                                const data = (queryResult as RowDataPacket[]).map(row => SqlHelper.toCamelCase(row) as StockInTable);
                                return ok(data);
                            });
                    }
                }
            );
    }

    create(report: StockInCreate): ResultAsync<number | null, Err> {

        const query = `INSERT INTO stock_in (provider_id, warehouse_men)
                       VALUES (?, ?)`;

        const detailQuery = `INSERT INTO stock_in_detail (stock_in_id, sku_id, amount, cost_price,total_price)
                        VALUES ?`

        const skuQuery = `UPDATE sku SET stock = CASE
                            ${report.items.map(r => `WHEN id = ? THEN stock + ?`)}
                            END
                          WHERE id IN (?)`;
        const skuValue = report.items.map(r =>[r.skuId,r.amount]).flat();
        const ids = report.items.map(r => r.skuId)
        const headerValues = [
            report.providerId,
            report.warehouseMen,
        ];
        return this.executeInTransaction(conn =>
            this.executeQuery(query, headerValues)
                .andThen(([headerResult, _]) => {
                    const header = headerResult as ResultSetHeader;
                    const insertId = header.insertId;

                    const detailValuesWithInsertId = report.items.map(item => [
                        insertId,
                        item.skuId,
                        item.amount,
                        item.costPrice,
                        item.totalPrice,
                    ]);

                    return this.executeQuery(detailQuery, [detailValuesWithInsertId])
                        .andThen(()=>
                            this.executeQuery(skuQuery, [...skuValue,...ids])
                        )
                        .map(() => insertId);
                })
        );
    }
}