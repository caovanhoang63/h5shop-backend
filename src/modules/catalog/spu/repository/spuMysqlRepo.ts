import {ok, okAsync, ResultAsync} from "neverthrow";
import {BaseMysqlRepo} from "../../../../components/mysql/BaseMysqlRepo";
import {ICondition} from "../../../../libs/condition";
import {Err} from "../../../../libs/errors";
import {Paging} from "../../../../libs/paging";
import {ResultSetHeader, RowDataPacket} from "mysql2";
import {SqlHelper} from "../../../../libs/sqlHelper";
import {ISpuRepository} from "./ISpuRepository";
import {SpuCreate} from "../entity/spuCreate";
import {SpuUpdate} from "../entity/spuUpdate";
import {Spu} from "../entity/spu";


export class SpuMysqlRepo extends BaseMysqlRepo implements ISpuRepository {
    create(c: SpuCreate): ResultAsync<void, Err> {
        const query = `INSERT INTO spu (name, description, metadata,images) VALUES (?, ?, ?,?) `;
        return this.executeQuery(query,[c.name,c.description,c.metadata,c.image]).andThen(
            ([r,f]) => {
                const header = r as ResultSetHeader;
                c.id = header.insertId;
                return okAsync(undefined)
            }
        );
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
        const countQuery = `SELECT COUNT(*) FROM spu ${clause}`;
        const query = `SELECT * FROM spu ${clause} ${pagingClause}`;
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
                            return ok(data)
                        }
                    )
            }
        )
    }

    findById(id: number): ResultAsync<Spu | null, Err> {
        const query = `SELECT * FROM spu WHERE id = ?`
        return this.executeQuery(query,[id]).andThen(
            ([r,f]) => {
                const firstRow = (r as RowDataPacket[])[0];
                if (!firstRow) {
                    return ok(null);
                } else {
                    return ok(firstRow as Spu);
                }
            }
        )
    }
}