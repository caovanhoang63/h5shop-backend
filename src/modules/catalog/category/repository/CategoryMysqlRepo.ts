import {errAsync, ok, okAsync, ResultAsync} from "neverthrow";
import {BaseMysqlRepo} from "../../../../components/mysql/BaseMysqlRepo";
import {ICondition} from "../../../../libs/condition";
import {createDatabaseError, Err} from "../../../../libs/errors";
import {Paging} from "../../../../libs/paging";
import {CategoryCreate} from "../entity/categoryCreate";
import {CategoryUpdate} from "../entity/categoryUpdate";
import {ICategoryRepository} from "./ICategoryRepository";
import {ResultSetHeader, RowDataPacket} from "mysql2";
import {SqlHelper} from "../../../../libs/sqlHelper";
import {Category} from "../entity/category";
import _ from "lodash";


export class CategoryMysqlRepo extends BaseMysqlRepo implements ICategoryRepository {
    create(c: CategoryCreate): ResultAsync<void, Err> {
        const query = `INSERT INTO category (name,level, parent_id, image) VALUES (?, ?, ?, ?) `;
        return this.executeQuery(query,[c.name,c.level,c.parentId,JSON.stringify(c.image)]).andThen(
            ([r,f]) => {
                const header = r as ResultSetHeader;
                c.id = header.insertId;
                return okAsync(undefined)
            }
        );
    }
    update(id: number, c: CategoryUpdate): ResultAsync<void, Err> {
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
        const time = Date.now()
        const [clause,values] = SqlHelper.buildWhereClause(cond)
        console.log( Date.now() - time)
        const pagingClause = SqlHelper.buildPaginationClause(paging)
        const countQuery = `SELECT COUNT(*) as total FROM category ${clause}`;
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
        const query = `WITH RECURSIVE category_tree AS (
            SELECT *, 0 as depth
            FROM category
            WHERE id = ?

            UNION ALL

            SELECT c.*, ct.depth + 1
            FROM category c
                     INNER JOIN category_tree ct ON c.parent_id = ct.id
        )
        SELECT * FROM category_tree`

        return this.executeQuery(query,[id]).andThen(
            ([r,f]) => {
                const results = (r as RowDataPacket[]);
                if (results.length == 0) {
                    return ok(null);
                }

                if (results.length == 1) {
                    return ok(SqlHelper.toCamelCase(results[0]) as Category);
                }

                const categories = results.map(result  => SqlHelper.toCamelCase(result,"depth") as Category)

                const category = categories[0];

                category.children = categories.slice(1);

                return ok(category)
            }
        )
    }
}