import {BaseMysqlRepo} from "../../../components/mysql/BaseMysqlRepo";
import {IProviderRepository} from "./IProviderRepository";
import {Provider, ProviderCreate} from "../entity/provider";
import {ok, okAsync, ResultAsync} from "neverthrow";
import {ICondition} from "../../../libs/condition";
import {Paging} from "../../../libs/paging";
import {ResultSetHeader, RowDataPacket} from "mysql2";
import {Err} from "../../../libs/errors";
import {SqlHelper} from "../../../libs/sqlHelper";

export class ProviderMySqlRepo extends BaseMysqlRepo implements IProviderRepository {
    create(provider: ProviderCreate): ResultAsync<void, Error> {
        const query = `INSERT INTO provider (name, address, phone, email, debt)
                       VALUES (?, ?, ?, ?, ?)`;
        return this.executeQuery(query, [provider.name, provider.address, provider.phone_number, provider.email, provider.debt]).andThen(([r, f]) => {
            const header = r as ResultSetHeader;
            return okAsync(undefined);
        });
    }

    delete(id: number): ResultAsync<void, Error> {
        const query = `UPDATE provider
                       SET STATUS = 0
                       WHERE id = ? `;
        return this.executeQuery(query, [id]).andThen(
            ([r, f]) => {
                const header = r as ResultSetHeader;
                return okAsync(undefined)
            }
        );
    }

    update(id: number, provider: Provider): ResultAsync<void, Error> {
        const [clause, values] = SqlHelper.buildUpdateClause(provider)
        const query = `UPDATE provider
                       SET ${clause}
                       WHERE id = ? `;
        return this.executeQuery(query, [...values, id]).andThen(
            ([r, f]) => {
                const header = r as ResultSetHeader;
                return okAsync(undefined)
            }
        );
    }

    list(cond: ICondition, paging: Paging): ResultAsync<Provider[] | null, Err> {
        const time = Date.now()
        const [clause, values] = SqlHelper.buildWhereClause(cond)
        console.log(Date.now() - time)
        const pagingClause = SqlHelper.buildPaginationClause(paging)
        const countQuery = `SELECT COUNT(*) as total
                            FROM provider ${clause}`;
        const query = `SELECT *
                       FROM provider ${clause} ${pagingClause}`;
        return this.executeQuery(countQuery, values).andThen(
            ([r, f]) => {
                const firstRow = (r as RowDataPacket[])[0];
                if (!firstRow) {
                    return okAsync({total: 0});
                }
                paging.total = firstRow.total;
                return ok({total: firstRow.total});
            }
        ).andThen(
            (r) => {
                if (r.total == 0)
                    return ok([]);
                else
                    return this.executeQuery(query, values).andThen(
                        ([r, f]) => {
                            const data = (r as RowDataPacket[]).map(row => SqlHelper.toCamelCase(row) as Provider);
                            return ok(data)
                        }
                    )
            })
    }


}