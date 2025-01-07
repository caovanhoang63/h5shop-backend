import {BaseMysqlRepo} from "../../../../components/mysql/BaseMysqlRepo";
import {IStockInRepository} from "../../stockIn/repository/IStockInRepository";
import {IStockOutRepository} from "./IStockOutRepository";
import {StockOutCreate} from "../entity/stockOut";
import {ok, ResultAsync} from "neverthrow";
import {StockOutDetailTable} from "../entity/stockOutDetailTable";
import {ICondition} from "../../../../libs/condition";
import {Paging} from "../../../../libs/paging";
import {StockOutTable} from "../entity/stockOutTable";
import {Err} from "../../../../libs/errors";
import {SqlHelper} from "../../../../libs/sqlHelper";
import {ResultSetHeader, RowDataPacket} from "mysql2";
import {query} from "express";
import {StockInDetailTable} from "../../stockIn/entity/stockInDetailTable";
import { StockOutReason} from "../entity/stockOutReason";

export class StockOutRepository extends BaseMysqlRepo implements IStockOutRepository {

    list(condition: ICondition, paging: Paging): ResultAsync<StockOutTable[] | null, Err> {
        const pagingClause = SqlHelper.buildPaginationClause(paging)
        const [whereClause, whereValues] = SqlHelper.buildWhereClause(condition, "so");
        const query = `
            SELECT so.*,
                   SUM(sod.amount) AS totalAmount,
                   sor.name        as stockOutReasonName,
                   sor.description as stockOutReasonDescription
            FROM stock_out so
                     JOIN stock_out_detail sod ON so.id = sod.stock_out_id
                     JOIN stock_out_reason sor ON so.stock_out_reason_id = sor.id
                ${whereClause}
            GROUP BY so.id ${pagingClause}
        `;
        const countQuery = `
            SELECT COUNT(DISTINCT so.id) AS total
            FROM stock_out so
                     JOIN stock_out_detail sod ON so.id = sod.stock_out_id
                ${whereClause}
        `;
        console.log(query, countQuery)
        return this.executeQuery(countQuery, whereValues)
            .andThen(([countResult, _]) => {
                const firstRow = (countResult as RowDataPacket[])[0];
                if (!firstRow) {
                    return ok({total: 0});
                }
                paging.total = firstRow.total;
                return ok({total: firstRow.total});
            })
            .andThen(
                (r) => {
                    if (r.total === 0) {
                        return ok([]);
                    } else {
                        return this.executeQuery(query, whereValues)
                            .andThen(([queryResult, _]) => {
                                const data = (queryResult as RowDataPacket[]).map(row => SqlHelper.toCamelCase(row) as StockOutTable);
                                return ok(data);
                            });
                    }
                }
            );
    }

    create(report: StockOutCreate): ResultAsync<number | null, Err> {
        const query = `INSERT INTO stock_out (warehouse_men, stock_out_reason_id)
                       VALUES (?, ?)`;

        const detailQuery = `INSERT INTO stock_out_detail (stock_out_id, sku_id, amount, cost_price, total_price)
                             VALUES ?`

        const skuQuery = `UPDATE sku
                          SET stock = CASE
                              ${report.items.map(r => `WHEN id = ? THEN stock - ?`)}
                              END
                          WHERE id IN (?)`;
        const skuValue = report.items.map(r => [r.skuId, r.amount]).flat();
        const ids = report.items.map(r => r.skuId)
        const headerValues = [
            report.warehouseMen,
            report.stockOutReasonId,
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
                        .andThen(() =>
                            this.executeQuery(skuQuery, [...skuValue, ...ids])
                        )
                        .map(() => insertId);
                })
        );
    }

    findById(reportId: number): ResultAsync<StockOutDetailTable | null, Err> {
        const query = `
            SELECT sod.*,
                   s.id                       as skuId,
                   spu.name                   as spuName,
                   so.warehouse_men           as warehouseMan,
                   u.last_name + u.first_name as warehouseName
            FROM stock_out_detail sod
                     JOIN stock_out so ON sod.stock_out_id = so.id
                     JOIN sku s ON sod.sku_id = s.id
                     JOIN spu spu ON s.spu_id = spu.id
                     JOIN user u ON so.warehouse_men = u.id
            WHERE sod.stock_out_id = ?`;

        return this.executeQuery(query, [reportId]).andThen(
            ([r, f]) => {
                const rows = r as RowDataPacket[];
                if (!rows.length) {
                    return ok(null);
                }
                const groupedResults: StockOutDetailTable = {
                    id: reportId,
                    providerId: 0,
                    providerName: "",
                    warehouseMen: 0,
                    warehouseName: "",
                    totalPrice: 0,
                    totalAmount: 0,
                    status: 1,
                    items: [],
                    createdAt: null,
                    updatedAt: null,
                };
                rows.forEach((row) => {
                    const camelRow = SqlHelper.toCamelCase(row);

                    groupedResults.totalAmount += camelRow.amount;
                    groupedResults.totalPrice = camelRow.totalPrice;
                    groupedResults.providerId = camelRow.providerId;
                    groupedResults.providerName = camelRow.providerName;
                    groupedResults.warehouseMen = camelRow.warehouseMan;
                    groupedResults.warehouseName = camelRow.warehouseName;
                    groupedResults.status = camelRow.status;
                    groupedResults.createdAt = camelRow.createdAt || groupedResults.createdAt;
                    groupedResults.updatedAt = camelRow.updatedAt || groupedResults.updatedAt;

                    groupedResults.items.push({
                        skuId: camelRow.skuId,
                        name: camelRow.spuName,
                        amount: camelRow.amount,
                        price: camelRow.costPrice
                    });
                })

                console.log(groupedResults)
                return ok(groupedResults);

            }
        );
    }

    listReason(condition: ICondition, paging: Paging): ResultAsync<StockOutReason[] | null, Err> {
        const pagingClause = SqlHelper.buildPaginationClause(paging)
        const [whereClause, whereValues] = SqlHelper.buildWhereClause(condition);
        const query = `
            SELECT sor.*
            FROM stock_out_reason sor`;
        console.log(query)
        return this.executeQuery(query,whereValues)
        .andThen(([queryResult,_]) =>{
            const rows = queryResult as RowDataPacket[];
            if (!rows.length) {}
            const data = (queryResult as RowDataPacket[]).map(row => SqlHelper.toCamelCase(row) as StockOutReason)
            return ok(data);
        })
    }

}
