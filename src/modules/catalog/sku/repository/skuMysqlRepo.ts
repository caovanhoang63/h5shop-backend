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
import {SkuDetail} from "../entity/skuDetail";
import {FilterSkuListDetail, SkuListDetail} from "../entity/skuListDetail";

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

    searchDetail(cond: ICondition, paging: Paging): ResultAsync<SkuDetail[] | null, Err> {
        const time = Date.now();
        let [clause, values] = SqlHelper.buildWhereClause(cond);
        console.log(Date.now() - time);
        if(clause.length > 0){
            clause = clause + ' AND sku.status = 1';
        } else {
            clause = ' WHERE sku.status = 1';
        }
        const pagingClause = SqlHelper.buildPaginationClause(paging);
        const countQuery = `SELECT COUNT(*) as total FROM sku LEFT JOIN spu ON spu.id = sku.spu_id ${clause}`;
        const query = `
            SELECT
                sku.id AS id,
                sku.spu_id AS spu_id,
                sku.sku_tier_idx AS sku_tier_idx,
                sku.cost_price AS cost_price,
                sku.price AS price,
                sku.stock AS stock,
                sku.images AS images,
                spu.name AS spu_name,
                (
                    SELECT JSON_ARRAYAGG(
                                   JSON_OBJECT(
                                           'name', sku_attr.name,
                                           'value', sku_attr.value
                                   )
                           )
                    FROM sku_attr 
                    WHERE sku_attr.spu_id = sku.spu_id AND sku_attr.status = 1
                ) AS attributes
            FROM sku
            LEFT JOIN spu ON sku.spu_id = spu.id
            ${clause} ${pagingClause}`;
        console.log(query);
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
                            const data = (r as RowDataPacket[]).map(row => SqlHelper.toCamelCase(row) as SkuDetail);
                            return ok(data)
                        }
                    )
            }
        )
    }

    listDetail(cond: FilterSkuListDetail, paging: Paging): ResultAsync<SkuListDetail[] | null, Err> {
        const time = Date.now();
        console.log(Date.now() - time);
        const pagingClause = SqlHelper.buildPaginationClause(paging);
        const countQuery = `
            SELECT COUNT(*) as total 
            FROM sku 
            INNER JOIN spu ON spu.id = sku.spu_id
            INNER JOIN category_to_spu ON category_to_spu.spu_id = spu.id
            INNER JOIN brand ON brand.id = spu.brand_id
            WHERE sku.status = 1 
                ${cond.categoryId ? `AND category_to_spu.category_id = ${cond.categoryId}` : ''}
                ${cond.brandId ? `AND spu.brand_id = ${cond.brandId}` : ''}
            `;

        const query = `
            SELECT
                sku.id AS id,
                sku.spu_id AS spu_id,
                sku.sku_tier_idx AS sku_tier_idx,
                sku.cost_price AS cost_price,
                sku.price AS price,
                sku.stock AS stock,
                sku.images AS images,
                spu.name AS spu_name,
                category.name AS category_name,
                brand.name AS brand_name,
                (
                    SELECT JSON_ARRAYAGG(
                                   JSON_OBJECT(
                                           'name', sku_attr.name,
                                           'value', sku_attr.value
                                   )
                           )
                    FROM sku_attr 
                    WHERE sku_attr.spu_id = sku.spu_id AND sku_attr.status = 1
                ) AS attributes,
                (
                    SELECT JSON_ARRAYAGG(
                                   JSON_OBJECT(
                                           'minQuantity', sku_wholesale_prices.min_quantity,
                                           'price', sku_wholesale_prices.price
                                   )
                           )
                    FROM sku_wholesale_prices
                    WHERE sku_wholesale_prices.sku_id = sku.id
                ) AS wholesale_prices
            FROM sku
            INNER JOIN spu ON sku.spu_id = spu.id
            INNER JOIN category_to_spu ON category_to_spu.spu_id = spu.id
            INNER JOIN category ON category.id = category_to_spu.category_id
            INNER JOIN brand ON brand.id = spu.brand_id
            WHERE sku.status = 1
                ${cond.categoryId ? `AND category_to_spu.category_id = ${cond.categoryId}` : ''}
                ${cond.brandId ? `AND spu.brand_id = ${cond.brandId}` : ''}
            ${pagingClause}`;

        return this.executeQuery(countQuery, []).andThen(
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
                    return this.executeQuery(query, []).andThen(
                        ([r, f]) => {
                            const data = (r as RowDataPacket[]).map(row => SqlHelper.toCamelCase(row) as SkuListDetail);
                            return ok(data)
                        }
                    )
            }
        )
    }

    getDetailById(id: number): ResultAsync<SkuListDetail | null, Err> {
        const countQuery = `
            SELECT COUNT(*) as total 
            FROM sku 
            INNER JOIN spu ON spu.id = sku.spu_id
            INNER JOIN category_to_spu ON category_to_spu.spu_id = spu.id
            INNER JOIN brand ON brand.id = spu.brand_id
            WHERE sku.status = 1 AND sku.id = ${id}
            `;

        const query = `
            SELECT
                sku.id AS id,
                sku.spu_id AS spu_id,
                sku.sku_tier_idx AS sku_tier_idx,
                sku.cost_price AS cost_price,
                sku.price AS price,
                sku.stock AS stock,
                sku.images AS images,
                spu.name AS spu_name,
                category.name AS category_name,
                brand.name AS brand_name,
                (
                    SELECT JSON_ARRAYAGG(
                                   JSON_OBJECT(
                                           'name', sku_attr.name,
                                           'value', sku_attr.value
                                   )
                           )
                    FROM sku_attr 
                    WHERE sku_attr.spu_id = sku.spu_id AND sku_attr.status = 1
                ) AS attributes,
                (
                    SELECT JSON_ARRAYAGG(
                                   JSON_OBJECT(
                                           'minQuantity', sku_wholesale_prices.min_quantity,
                                           'price', sku_wholesale_prices.price
                                   )
                           )
                    FROM sku_wholesale_prices
                    WHERE sku_wholesale_prices.sku_id = sku.id
                ) AS wholesale_prices
            FROM sku
            INNER JOIN spu ON sku.spu_id = spu.id
            INNER JOIN category_to_spu ON category_to_spu.spu_id = spu.id
            INNER JOIN category ON category.id = category_to_spu.category_id
            INNER JOIN brand ON brand.id = spu.brand_id
            WHERE sku.status = 1 AND sku.id = ${id}`;
        return this.executeQuery(query, [id]).andThen(
            ([r, f]) => {
                const firstRow = (r as RowDataPacket[])[0];
                if(!firstRow) {
                    return ok(null);
                }
                return ok(SqlHelper.toCamelCase(firstRow) as SkuListDetail)
            }
        );
    }
}