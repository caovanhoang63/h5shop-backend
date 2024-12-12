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

    list(cond: ICondition, paging: Paging): ResultAsync<Spu[] | null, Err> {
        const [clause,values] = SqlHelper.buildWhereClause(cond)
        const pagingClause = SqlHelper.buildPaginationClause(paging)
        const countQuery = `SELECT COUNT(*) as total FROM spu  ${clause}`;
        const query = `SELECT spu.*, category_to_spu.category_id as category_id FROM spu LEFT JOIN  category_to_spu ON spu.id = category_to_spu.spu_id ${clause} ${pagingClause}`;
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
                            const data = (r as RowDataPacket[]).map(row => SqlHelper.toCamelCase(row) as Spu);
                            console.log(data)
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
            INSERT INTO spu (id, name, description, metadata, images)
            VALUES (?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                                     name = VALUES(name),
                                     description = VALUES(description),
                                     metadata = VALUES(metadata),
                                     images = VALUES(images)
        `;

        const queryCate = `INSERT INTO category_to_spu (category_id, spu_id) VALUE (?,?)`;

        return this.executeInTransaction(conn => {
            return ResultAsync.fromPromise(
                conn.query(query,[c.id ,c.name,c.description,JSON.stringify(c.metadata),JSON.stringify(c.images)]),
                e => createDatabaseError(e)
            ).andThen(([r,f]) => {
                const header = r as ResultSetHeader;
                if(!c.id){
                    c.id = header.insertId;
                }
                return okAsync({id : c.id})
            }).andThen(r =>
                ResultAsync.fromPromise(
                    conn.query(queryCate,[r.id,c.categoryId]),
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
}