import { Category } from "@prisma/client";
import {errAsync, ok, okAsync, ResultAsync} from "neverthrow";
import {BaseMysqlRepo} from "../../../../components/mysql/BaseMysqlRepo";
import {ICondition} from "../../../../libs/condition";
import {createDatabaseError, Err} from "../../../../libs/errors";
import {Paging} from "../../../../libs/paging";
import {categoryCreate} from "../entity/categoryCreate";
import {categoryUpdate} from "../entity/categoryUpdate";
import {ICategoryRepository} from "./ICategoryRepository";
import {ResultSetHeader, RowDataPacket} from "mysql2";
import {SqlHelper} from "../../../../libs/sqlHelper";
import {Audit} from "../../../audit/entity/audit";


export class CategoryMysqlRepo extends BaseMysqlRepo implements ICategoryRepository {
    create(c: categoryCreate): ResultAsync<void, Err> {
        const query = `INSERT INTO category (name, description, metadata) VALUES (?, ?, ?) `;
        return this.executeQuery(query,[c.name,c.description,c.metadata]).andThen(
            ([r,f]) => {
                const header = r as ResultSetHeader;
                return okAsync(undefined)
            }
        );

    }
    update(id: number, c: categoryUpdate): ResultAsync<void, Err> {
        const [clause,values] = SqlHelper.buildUpdateClause(c)
        const query = `UPDATE category SET ${clause} WHERE id = ? `;
        return this.executeQuery(query,[...values,id]).andThen(
            ([r,f]) => {
                const header = r as ResultSetHeader;
                return okAsync(undefined)
            }
        );
    }
    delete(id: number): ResultAsync<void, Err> {
        const query = `UPDATE category SET STATUS = 0 WHERE id = ? `;
        return this.executeQuery(query,[id]).andThen(
            ([r,f]) => {
                const header = r as ResultSetHeader;
                return okAsync(undefined)
            }
        );
    }

    list(cond: ICondition, paging: Paging): ResultAsync<Category[] | null, Err> {
        const [clause,values] = SqlHelper.buildWhereClause(cond)
        const pagingClause = SqlHelper.buildPaginationClause(paging)
        const countQuery = `SELECT COUNT(*) FROM category ${clause}`;
        const query = `SELECT * FROM category ${clause} ${pagingClause}`;
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
                            const data = (r as RowDataPacket[]).map(row => SqlHelper.toCamelCase(row) as Category);
                            return ok(data)
                        }
                    )
            }
        )
    }

    findById(id: number): ResultAsync<Category | null, Err> {
        const query = `SELECT * FROM category WHERE id = ?`
        return this.executeQuery(query,[id]).andThen(
            ([r,f]) => {
                const firstRow = (r as RowDataPacket[])[0];
                if (!firstRow) {
                    return ok(null);
                } else {
                    return ok(firstRow as Category);
                }
            }
        )
    }
}