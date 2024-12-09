import {BaseMysqlRepo} from "../../../../components/mysql/BaseMysqlRepo";
import {IBrandRepository} from "./IBrandRepository";
import {BrandCreate} from "../entity/brandCreate";
import {ok, okAsync, ResultAsync} from "neverthrow";
import {Err} from "../../../../libs/errors";
import {ResultSetHeader, RowDataPacket} from "mysql2";
import {ICondition} from "../../../../libs/condition";
import {Paging} from "../../../../libs/paging";
import {SqlHelper} from "../../../../libs/sqlHelper";
import {Brand} from "../entity/brand";

export class BrandMysqlRepo extends BaseMysqlRepo implements IBrandRepository {
    create(c: BrandCreate): ResultAsync<void, Err> {
        const query = `INSERT INTO brand (name) VALUES (?) `;
        return this.executeQuery(query, [c.name,]).andThen(
            ([r,f]) => {
                const header = r as ResultSetHeader;
                return okAsync(undefined)
            }
        )
    }

    update(id: number, c: BrandCreate): ResultAsync<void, Err> {
        const [clause,values] = SqlHelper.buildUpdateClause(c)
        const query = `UPDATE brand SET ${clause} WHERE id = ? `;
        return this.executeQuery(query,[...values,id]).andThen(
            ([r,f]) => {
                const header = r as ResultSetHeader;
                return okAsync(undefined)
            }
        );
    }

    delete(id: number): ResultAsync<void, Err> {
        const query = `UPDATE brand SET STATUS = 0 WHERE id = ? `;
        return this.executeQuery(query,[id]).andThen(
            ([r,f]) => {
                const header = r as ResultSetHeader;
                return okAsync(undefined)
            }
        );
    }

    list(cond: ICondition, paging: Paging): ResultAsync<Brand[] | null, Err> {
        const time = Date.now()
        const [clause,values] = SqlHelper.buildWhereClause(cond)
        console.log( Date.now() - time)
        const pagingClause = SqlHelper.buildPaginationClause(paging)
        const countQuery = `SELECT COUNT(*) as total FROM brand ${clause}`;
        const query = `SELECT * FROM brand ${clause} ${pagingClause}`;
        return this.executeQuery(countQuery,values).andThen(
            ([r,f]) => {
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
                    return this.executeQuery(query,values).andThen(
                        ([r,f]) => {
                            const data = (r as RowDataPacket[]).map(row => SqlHelper.toCamelCase(row) as Brand);
                            return ok(data)
                        }
                    )
            })
    }

    findById(id: number): ResultAsync<BrandCreate | null, Err> {
        const query = `SELECT * FROM brand WHERE id = ? `;
        return this.executeQuery(query, [id]).andThen(
            ([r,f]) => {
                const firstRow = (r as RowDataPacket[])[0];
                if(!firstRow) {
                    return ok(null);
                }
                return ok(SqlHelper.toCamelCase(firstRow) as BrandCreate)
            }
        )
    }
}