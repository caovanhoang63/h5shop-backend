import {ok, okAsync, ResultAsync} from "neverthrow";
import {BaseMysqlRepo} from "../../../../components/mysql/BaseMysqlRepo";
import {ICondition} from "../../../../libs/condition";
import {Err} from "../../../../libs/errors";
import {Paging} from "../../../../libs/paging";
import {SkuAttr} from "../entity/skuAttr";
import {SkuAttrCreate} from "../entity/skuAttrCreate";
import {SkuAttrUpdate} from "../entity/skuAttrUdate";
import {ISkuAttrRepository} from "./ISkuAttrRepository";
import {injectable} from "inversify";
import {ResultSetHeader, RowDataPacket} from "mysql2";
import {SqlHelper} from "../../../../libs/sqlHelper";

@injectable()
export class SkuAttrMysqlRepo extends BaseMysqlRepo implements ISkuAttrRepository {
    addBulk(records: SkuAttrCreate[]): ResultAsync<void, Err> {
        const placeholders = records.map(() => '(?, ?, ?, ?, ?)').join(',');

        const query = `INSERT INTO sku_attr (spu_id, name, data_type, value, images) VALUES ${placeholders}`;

        const params = records.flatMap(c => [
            c.spuId,
            c.name,
            c.dataType,
            JSON.stringify(c.value),
            JSON.stringify(c.images)
        ]);

        return this.executeQuery(query, params).andThen(
            ([r, f]) => {
                const header = r as ResultSetHeader;
                records.forEach((record, index) => {
                    record.id = header.insertId + index;
                });
                return okAsync(undefined);
            }
        );
    }

    create(c: SkuAttrCreate): ResultAsync<void, Err> {
        const query = `INSERT INTO sku_attr (spu_id, name, data_type, value, images) VALUES (?, ?, ?,?,?) `;
        return this.executeQuery(query,[c.spuId,c.name,c.dataType,JSON.stringify(c.value),JSON.stringify(c.images)]).andThen(
            ([r,f]) => {
                const header = r as ResultSetHeader;
                c.id = header.insertId;
                return okAsync(undefined)
            }
        );
    }

    update(id: number, c: SkuAttrUpdate): ResultAsync<void, Err> {
        const [clause,values] = SqlHelper.buildUpdateClause(c)
        const query = `UPDATE sku_attr SET ${clause} WHERE id = ? `;
        return this.executeQuery(query,[...values,id]).andThen(
            ([r,f]) => {
                const header = r as ResultSetHeader;
                return okAsync(undefined)
            }
        );
    }

    delete(id: number): ResultAsync<void, Err> {
        const query = `UPDATE sku_attr SET STATUS = 0 WHERE id = ? `;
        return this.executeQuery(query,[id]).andThen(
            ([r,f]) => {
                const header = r as ResultSetHeader;
                return okAsync(undefined)
            }
        );
    }

    list(cond: ICondition, paging: Paging): ResultAsync<SkuAttr[] | null, Err> {
        const [clause,values] = SqlHelper.buildWhereClause(cond)
        const pagingClause = SqlHelper.buildPaginationClause(paging)
        const countQuery = `SELECT COUNT(*) as total FROM sku_attr ${clause}`;
        const query = `SELECT * FROM sku_attr ${clause} ${pagingClause}`;
        return this.executeQuery(countQuery,values).andThen(
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
                        query,values
                    ).andThen(
                        ([r, f]) => {
                            const data = (r as RowDataPacket[]).map(row => SqlHelper.toCamelCase(row) as SkuAttr);
                            return ok(data)
                        }
                    )
            }
        )
    }

    findById(id: number): ResultAsync<SkuAttr | null, Err> {
        const query = `SELECT * FROM category WHERE id = ?`
        return this.executeQuery(query,[id]).andThen(
            ([r,f]) => {
                const firstRow = (r as RowDataPacket[])[0];
                if (!firstRow) {
                    return ok(null);
                } else {
                    return ok(firstRow as SkuAttr);
                }
            }
        )
    }

    upsertMany(records: SkuAttrCreate[]): ResultAsync<void, Err> {
        const placeholders = records.map(() => '(?, ?, ?, ?, ?, ?)').join(',');

        const query = `
            INSERT INTO sku_attr (id, spu_id, name, data_type, value, images) 
            VALUES ${placeholders}
            ON DUPLICATE KEY UPDATE 
                spu_id = VALUES(spu_id),
                name = VALUES(name),
                data_type = VALUES(data_type),
                value = VALUES(value),
                images = VALUES(images)
            `;

        const params = records.flatMap(c => [
            c.id || null,
            c.spuId,
            c.name,
            c.dataType,
            JSON.stringify(c.value),
            JSON.stringify(c.images)
        ]);

        return this.executeQuery(query, params).andThen(
            ([r, f]) => {
                return okAsync(undefined);
            }
        );
    }
}