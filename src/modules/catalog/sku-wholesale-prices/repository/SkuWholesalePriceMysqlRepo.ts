import {BaseMysqlRepo} from "../../../../components/mysql/BaseMysqlRepo";
import {ISkuWholesalePriceRepository} from "./ISkuWholesalePriceRepository";
import {SkuWholesalePriceCreate} from "../entity/SkuWholesalePriceCreate";
import {ok, okAsync, ResultAsync} from "neverthrow";
import {Err} from "../../../../libs/errors";
import {ICondition} from "../../../../libs/condition";
import {Paging} from "../../../../libs/paging";
import {SkuWholesalePrice} from "../entity/SkuWholesalePrice";
import {ResultSetHeader, RowDataPacket} from "mysql2";
import {SqlHelper} from "../../../../libs/sqlHelper";

export class SkuWholesalePriceMysqlRepo extends BaseMysqlRepo implements ISkuWholesalePriceRepository {
    delete(id: number): ResultAsync<void, Err> {
        const query = `DELETE FROM sku_wholesale_prices WHERE id = ? `;
        return this.executeQuery(query,[id]).andThen(
            ([r,f]) => {
                const header = r as ResultSetHeader;
                return okAsync(undefined)
            }
        );
    }

    list(cond: ICondition, paging: Paging): ResultAsync<SkuWholesalePrice[] | null, Err> {
        const time = Date.now();
        const [clause, values] = SqlHelper.buildWhereClause(cond);
        console.log(Date.now() - time);
        const pagingClause = SqlHelper.buildPaginationClause(paging);
        const countQuery = `SELECT COUNT(*) as total FROM sku_wholesale_prices ${clause}`;
        const query = `SELECT * FROM sku_wholesale_prices ${clause} ${pagingClause}`;
        return this.executeQuery(countQuery, values).andThen(
            ([r, f]) => {
                const firstRow = (r as RowDataPacket[])[0];
                if(!firstRow) {
                    return okAsync({total: 0});
                }
                paging.total = firstRow.total;
                return ok({total: firstRow.total});
            }
        ).andThen(
            (r) => {
                if(r.total == 0)
                    return ok([]);
                else
                    return this.executeQuery(query, values).andThen(
                        ([r, f]) => {
                            const data = (r as RowDataPacket[]).map(row => SqlHelper.toCamelCase(row) as SkuWholesalePrice);
                            return ok(data)
                        }
                    )
            }
        )
    }

    findById(id: number): ResultAsync<SkuWholesalePrice | null, Err> {
        const query = `SELECT * FROM sku_wholesale_prices WHERE id = ?`;
        return this.executeQuery(query, [id]).andThen(
            ([r, f]) => {
                const firstRow = (r as RowDataPacket[])[0];
                if(!firstRow) {
                    return ok(null);
                }
                return ok(SqlHelper.toCamelCase(firstRow) as SkuWholesalePrice);
            }
        )
    }

    upsertMany(c: SkuWholesalePriceCreate[]): ResultAsync<void, Err> {
        const placeholders = c.map(() => '(?, ?, ?, ?)').join(',');

        const query = `
            INSERT INTO sku_wholesale_prices (id, sku_id, min_quantity, price) 
            VALUES ${placeholders}
            ON DUPLICATE KEY UPDATE 
                sku_id = VALUES(sku_id),
                min_quantity = VALUES(min_quantity),
                price = VALUES(price)
            `;

        const params = c.flatMap(c => [
            c.id || null,
            c.skuId,
            c.minQuantity,
            c.price
        ]);

        return this.executeQuery(query, params).andThen(
            ([r, f]) => {
                const header = r as ResultSetHeader;
                c.forEach((record, idx) => {
                    // get id from insertId if id is not provided
                    if(!record.id) {
                        record.id = header.insertId + idx;
                    }
                });
                return okAsync(undefined);
            }
        );
    }
}