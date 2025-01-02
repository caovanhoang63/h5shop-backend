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

export class StockOutRepository extends BaseMysqlRepo implements IStockOutRepository {

    list(condition: ICondition, paging: Paging): ResultAsync<StockOutTable[] | null, Err> {
        const pagingClause = SqlHelper.buildPaginationClause(paging)
        const [whereClause, whereValues] = SqlHelper.buildWhereClause(condition,"so");
        const query = `
            SELECT
                so.*,
                SUM(sod.amount) AS totalAmount,
                sor.name,
                sor.description
            FROM
                stock_out so
                    JOIN stock_out_detail sod ON so.id = sod.stock_out_id
                    JOIN sku s ON sod.sku_id = s.id
                    JOIN stock_out_reason sor ON so.stock_out_reason_id = sor.id
                ${whereClause}
            GROUP BY so.id
                ${pagingClause}
        `;
        const countQuery = `
            SELECT COUNT(DISTINCT so.id) AS total
            FROM stock_out so
                     JOIN stock_out_detail sod ON so.id = sod.stock_out_id
                ${whereClause}
        `;
            console.log(query,countQuery)
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
                                const data = (queryResult as RowDataPacket[]).map(row => SqlHelper.toCamelCase(row) as StockOutTable);
                                console.log("gege",data)
                                return ok(data);
                            });
                    }
                }
            );
    }

    create(report: StockOutCreate): ResultAsync<number | null, Err> {
        const query = `INSERT INTO stock_out (warehouse_men, stock_out_reason_id)
                       VALUES (?, ?)`;

        const detailQuery = `INSERT INTO stock_out_detail (stock_out_id, sku_id, amount, cost_price,total_price)
                        VALUES ?`

        const skuQuery = `UPDATE sku SET stock = CASE
                            ${report.items.map(r => `WHEN id = ? THEN stock - ?`)}
                            END
                          WHERE id IN (?)`;
        const skuValue = report.items.map(r =>[r.skuId,r.amount]).flat();
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
                        .andThen(()=>
                            this.executeQuery(skuQuery, [...skuValue,...ids])
                        )
                        .map(() => insertId);
                })
        );
    }

}
