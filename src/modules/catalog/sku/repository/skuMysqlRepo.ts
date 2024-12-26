import {ISkuRepository} from "./ISkuRepository";
import {SkuCreate} from "../entity/skuCreate";
import {ok, okAsync, ResultAsync} from "neverthrow";
import {ICondition} from "../../../../libs/condition";
import {Paging} from "../../../../libs/paging";
import {Sku} from "../entity/sku";
import {Err} from "../../../../libs/errors";
import {BaseMysqlRepo} from "../../../../components/mysql/BaseMysqlRepo";
import {ResultSetHeader, RowDataPacket} from "mysql2";
import {SqlHelper} from "../../../../libs/sqlHelper";

export class SkuMysqlRepo extends BaseMysqlRepo implements ISkuRepository{

    upsertMany(records: SkuCreate[]): ResultAsync<SkuCreate[], Err> {
        const placeholders = records.map(() => '(?, ?, ?, ?, ?, ?, ?)').join(',');

        const query = `
            INSERT INTO sku (id, spu_id, sku_tier_idx, images, cost_price, price, stock) 
            VALUES ${placeholders}
            ON DUPLICATE KEY UPDATE 
                sku_tier_idx = VALUES(sku_tier_idx),
                images = VALUES(images),
                cost_price = VALUES(cost_price),
                price = VALUES(price),
                stock = VALUES(stock)
            `;

        const params = records.flatMap(c => [
            c.id || null,
            c.spuId,
            JSON.stringify(c.skuTierIdx),
            JSON.stringify(c.images),
            c.costPrice,
            c.price,
            c.stock
        ]);

        return this.executeQuery(query, params).andThen(
            ([r, f]) => {
                const header = r as ResultSetHeader;
                records.forEach((record, idx) => {
                    // get id from insertId if id is not provided
                    if(!record.id) {
                        record.id = header.insertId + idx;
                    }
                });
                return okAsync(records);
            }
        );
    }

    delete(id: number): ResultAsync<void, Err> {
        const query = `UPDATE sku SET STATUS = 0 WHERE id = ? `;
        return this.executeQuery(query,[id]).andThen(
            ([r,f]) => {
                const header = r as ResultSetHeader;
                return okAsync(undefined)
            }
        );
    }

    list(cond: ICondition, paging: Paging): ResultAsync<Sku[] | null, Err> {
        const time = Date.now();
        const [clause, values] = SqlHelper.buildWhereClause(cond);
        console.log(Date.now() - time);
        const pagingClause = SqlHelper.buildPaginationClause(paging);
        const countQuery = `SELECT COUNT(*) as total FROM sku ${clause}`;
        const query = `SELECT * FROM sku ${clause} ${pagingClause}`;
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
                            const data = (r as RowDataPacket[]).map(row => SqlHelper.toCamelCase(row) as Sku);
                            return ok(data)
                        }
                    )
            }
        )
    }

    findById(id: number): ResultAsync<Sku | null, Err> {
        const query = `SELECT * FROM sku WHERE id = ?`;
        return this.executeQuery(query, [id]).andThen(
            ([r, f]) => {
                const firstRow = (r as RowDataPacket[])[0];
                if(!firstRow) {
                    return ok(null);
                }
                return ok(SqlHelper.toCamelCase(firstRow) as Sku)
            }
        );
    }
}