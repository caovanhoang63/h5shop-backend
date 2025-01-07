import {err, ok, okAsync, ResultAsync} from "neverthrow";
import {BaseMysqlRepo} from "../../../../components/mysql/BaseMysqlRepo";
import {ICondition} from "../../../../libs/condition";
import {createDatabaseError, Err} from "../../../../libs/errors";
import {Paging} from "../../../../libs/paging";
import {ResultSetHeader, RowDataPacket} from "mysql2";
import {SqlHelper} from "../../../../libs/sqlHelper";
import {ISpuRepository} from "./ISpuRepository";
import {SpuCreate} from "../entity/spuCreate";
import {SpuUpdate} from "../entity/spuUpdate";
import {Spu} from "../entity/spu";
import {SpuDetailUpsert} from "../entity/spuDetailUpsert";
import {SpuDetail} from "../entity/spuDetail";
import {SpuFilter} from "../entity/spuFilterSchema";
import {object} from "joi";


export class SpuMysqlRepo extends BaseMysqlRepo implements ISpuRepository {
    create(c: SpuCreate): ResultAsync<void, Err> {
        const query = `INSERT INTO spu (name, description, metadata,images) VALUES (?, ?, ?, ?) `;
        const queryCate = `INSERT INTO category_to_spu (category_id, spu_id) VALUE (?,?)`;
        return this.executeInTransaction(conn => {
            return ResultAsync.fromPromise(
                conn.query(query,[c.name,c.description,JSON.stringify(c.metadata),JSON.stringify(c.images)]),
                e => createDatabaseError(e)
            ).andThen(([r,f]) => {
                const header = r as ResultSetHeader;
                c.id = header.insertId;
                return okAsync({id : c.id})
            }).andThen(r =>
                ResultAsync.fromPromise(
                    conn.query(queryCate,[r.id,c.categoryId]),
                    e => createDatabaseError(e)
                )
            ).andThen(([r,f]) => {
                return ok(undefined)
            });
        })
    }

    update(id: number, c: SpuUpdate): ResultAsync<void, Err> {
        const [clause,values] = SqlHelper.buildUpdateClause(c)
        const query = `UPDATE spu SET ${clause} WHERE id = ? `;
        return this.executeQuery(query,[...values,id]).andThen(
            ([r,f]) => {
                const header = r as ResultSetHeader;
                return okAsync(undefined)
            }
        );
    }

    delete(id: number): ResultAsync<void, Err> {
        const query = `UPDATE spu SET STATUS = 0 WHERE id = ? `;
        return this.executeQuery(query,[id]).andThen(
            ([r,f]) => {
                const header = r as ResultSetHeader;
                return okAsync(undefined)
            }
        );
    }

    list(cond: SpuFilter, paging: Paging): ResultAsync<Spu[] | null, Err> {
        const pagingClause = SqlHelper.buildPaginationClause(paging)

        const countQuery = `
            SELECT COUNT(*) as total 
            FROM spu
            LEFT JOIN category_to_spu ON spu.id = category_to_spu.spu_id
            LEFT JOIN category ON category.id = category_to_spu.category_id
            LEFT JOIN brand ON brand.id = spu.brand_id
            WHERE 1 = 1
                ${cond.brandId ? 'AND spu.brand_id = ?' : ''}
                ${cond.categoryId ? 'AND category_to_spu.category_id = ?' : ''}
                ${cond.name ? 'AND spu.name LIKE concat(?, \'%\')' : ''}
                ${cond.status != undefined ? `AND spu.status = ${cond.status}` : ''}
            `;
        const query = `
            SELECT spu.*, category_to_spu.category_id as category_id, category.name as category_name, brand.name as brand_name,
                   'providers', (
                       SELECT JSON_ARRAYAGG(
                                      JSON_OBJECT(
                                              'id', provider.id,
                                              'name', provider.name,
                                              'email', provider.email,
                                              'phone', provider.phone_number
                                      ))
                       FROM spu_to_provider
                       JOIN provider ON provider.id = spu_to_provider.provider_id
                       WHERE spu_to_provider.spu_id = spu.id AND provider.status = 1
                   )
            FROM spu
            LEFT JOIN category_to_spu ON spu.id = category_to_spu.spu_id 
            LEFT JOIN category ON category.id = category_to_spu.category_id
            LEFT JOIN brand ON brand.id = spu.brand_id
            WHERE 1 = 1
                ${cond.brandId ? 'AND spu.brand_id = ?' : ''}
                ${cond.categoryId ? 'AND category_to_spu.category_id = ?' : ''}
                ${cond.name ? 'AND spu.name LIKE concat(?, \'%\')' : ''}
                ${cond.status != undefined ? `AND spu.status = ${cond.status}` : ''}
                AND spu.status = 1
            ORDER BY spu.id DESC
                ${pagingClause}
            
            `;
        const value =[cond.brandId,cond.categoryId,cond.name].filter(r => !!r)
        return this.executeQuery(countQuery,value).andThen(
            ([r,f]) => {
                const firstRow = (r as RowDataPacket[])[0];
                if (!firstRow) {
                    return ok({total: 0});
                }
                paging.total = firstRow.total
                return ok({total: firstRow.total});
            }
        ).andThen(
            (r) => {
                if (r.total == 0)
                    return ok([])
                else
                    return this.executeQuery(
                        query,value
                    ).andThen(
                        ([r, f]) => {
                            const data = (r as RowDataPacket[]).map(row => SqlHelper.toCamelCase(row) as Spu);
                            return ok(data)
                        }
                    )
            }
        )
    }

    findById(id: number): ResultAsync<Spu | null, Err> {
        const query = `SELECT spu.*, category_to_spu.category_id as category_id FROM spu LEFT JOIN category_to_spu ON spu.id = category_to_spu.spu_id WHERE id = ?`
        return this.executeQuery(query,[id]).andThen(
            ([r,f]) => {
                const firstRow = (r as RowDataPacket[])[0];
                if (!firstRow) {
                    return ok(null);
                } else {
                    return ok(SqlHelper.toCamelCase(firstRow) as Spu);
                }
            }
        )
    }

    upsert(c: SpuCreate): ResultAsync<number, Err> {
        const query = `
            INSERT INTO spu (id, name, brand_id, description, metadata, images, time_warranty, time_return, type_time_warranty, type_time_return)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                                     name = VALUES(name),
                                     brand_id = VALUES(brand_id),
                                     description = VALUES(description),
                                     metadata = VALUES(metadata),
                                     images = VALUES(images),
                                     time_warranty = VALUES(time_warranty),
                                     time_return = VALUES(time_return),
                                     type_time_warranty = VALUES(type_time_warranty),
                                     type_time_return = VALUES(type_time_return);
        `;

        const queryCate = `
            INSERT INTO category_to_spu (category_id, spu_id)
            VALUES (?, ?)
                ON DUPLICATE KEY UPDATE
                                     category_id = category_id,
                                     spu_id = spu_id;
        `;


        return this.executeInTransaction(conn => {
            return ResultAsync.fromPromise(
                conn.query(query,[
                    c.id ,
                    c.name,
                    c.brandId,
                    c.description,
                    JSON.stringify(c.metadata),
                    JSON.stringify(c.images),
                    c.timeWarranty,
                    c.timeReturn,
                    c.typeTimeWarranty,
                    c.typeTimeReturn
                ]),
                e => createDatabaseError(e)
            ).andThen(([r,f]) => {
                const header = r as ResultSetHeader;
                if(!c.id){
                    c.id = header.insertId;
                }
                return okAsync({id : c.id})
            }).andThen(r =>
                ResultAsync.fromPromise(
                    conn.query(queryCate,[c.categoryId,r.id]),
                    e => createDatabaseError(e),
                )
            ).andThen(([r,f]) => {
                if(c.id){
                    return ok(c.id)
                }
                else{
                    return err(createDatabaseError(f))
                }
            });
        })
    }

    getDetail(id: number): ResultAsync<SpuDetail | null, Err> {
        const query = `
            SELECT
                JSON_OBJECT(
                    'id', spu.id,
                    'name', spu.name,
                    'brandId', spu.brand_id,
                    'brandName', brand.name,
                    'categoryId', category_to_spu.category_id,
                    'categoryName', category.name,
                    'description', spu.description,
                    'metadata', spu.metadata,
                    'timeReturn', spu.time_return,
                    'timeWarranty', spu.time_warranty,
                    'typeTimeWarranty', spu.type_time_warranty,
                    'typeTimeReturn', spu.type_time_return,
                    'images', (
                        SELECT JSON_ARRAYAGG(
                               JSON_OBJECT(
                                       'id', JSON_EXTRACT(img.value, '$.id'),
                                       'width', JSON_EXTRACT(img.value, '$.width'),
                                       'height', JSON_EXTRACT(img.value, '$.height'),
                                       'url', JSON_EXTRACT(img.value, '$.url'),
                                       'extension', JSON_EXTRACT(img.value, '$.extension'),
                                       'cloud', JSON_EXTRACT(img.value, '$.cloud')
                               ))
                        FROM JSON_TABLE(spu.images, '$[*]' COLUMNS(value JSON PATH '$')) img
                    ),
                    'outOfStock', spu.out_of_stock,
                    'status', spu.status,
                    'attrs', (
                        SELECT JSON_ARRAYAGG(
                               JSON_OBJECT(
                                       'id', sku_attr.id,
                                       'spuId', sku_attr.spu_id,
                                       'name', sku_attr.name,
                                       'dataType', sku_attr.data_type,
                                       'value', sku_attr.value
                               ))
                        FROM sku_attr
                        WHERE sku_attr.spu_id = spu.id AND sku_attr.status = 1
                    ),
                    'skus', (
                        SELECT JSON_ARRAYAGG(
                               JSON_OBJECT(
                                       'id', sku.id,
                                       'spuId', sku.spu_id,
                                       'skuTierIdx', sku.sku_tier_idx,
                                       'images', (
                                           SELECT JSON_ARRAYAGG(
                                                  JSON_OBJECT(
                                                          'id', JSON_EXTRACT(img.value, '$.id'),
                                                          'width', JSON_EXTRACT(img.value, '$.width'),
                                                          'height', JSON_EXTRACT(img.value, '$.height'),
                                                          'url', JSON_EXTRACT(img.value, '$.url'),
                                                          'extension', JSON_EXTRACT(img.value, '$.extension'),
                                                          'cloud', JSON_EXTRACT(img.value, '$.cloud')
                                                  ))
                                           FROM JSON_TABLE(sku.images, '$[*]' COLUMNS(value JSON PATH '$')) img
                                       ),
                                       'costPrice', sku.cost_price,
                                       'price', sku.price,
                                       'stock', sku.stock,
                                       'wholesalePrices', (
                                           SELECT JSON_ARRAYAGG(
                                                  JSON_OBJECT(
                                                          'id', swp.id,
                                                          'skuId', swp.sku_id,
                                                          'minQuantity', swp.min_quantity,
                                                          'price', swp.price
                                                  ))
                                           FROM sku_wholesale_prices swp
                                           WHERE swp.sku_id = sku.id 
                                       )
                               ))
                        FROM sku
                        WHERE sku.spu_id = spu.id AND sku.status = 1
                    ),
                    'providers', (
                        SELECT JSON_ARRAYAGG(
                                       JSON_OBJECT(
                                               'id', provider.id,
                                               'name', provider.name,
                                               'email', provider.email,
                                               'phone', provider.phone_number
                                       ))
                        FROM spu_to_provider
                        JOIN provider ON provider.id = spu_to_provider.provider_id
                        WHERE spu_to_provider.spu_id = spu.id AND provider.status = 1
                    )
                ) AS spu_detail
            FROM spu
                LEFT JOIN brand ON brand.id = spu.brand_id
                LEFT JOIN category_to_spu ON category_to_spu.spu_id = spu.id
                LEFT JOIN category ON category.id = category_to_spu.category_id
            WHERE spu.id = ?
        `;

        return this.executeQuery(query,[id]).andThen(
            ([r,f]) => {
                const firstRow = (r as RowDataPacket[])[0];
                if (!firstRow) {
                    return ok(null);
                } else {
                    return ok(SqlHelper.toCamelCase(firstRow) as SpuDetail);
                }
            }
        )
    }
}