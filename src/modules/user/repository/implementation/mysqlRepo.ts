import {ResultSetHeader, RowDataPacket} from "mysql2";
import {UserCreate} from "../../entity/userCreate";
import {ICondition} from "../../../../libs/condition";
import {User, UserEntityName} from "../../entity/user";
import {SqlHelper} from "../../../../libs/sqlHelper";
import {Paging} from "../../../../libs/paging";
import {MysqlErrHandler} from "../../../../libs/mysqlErrHandler";
import {err, ok, ResultAsync} from "neverthrow";
import {Err} from "../../../../libs/errors";
import {IUserRepository} from "../IUserRepository";
import {BaseMysqlRepo} from "../../../../components/mysql/BaseMysqlRepo";

export class UserMysqlRepo extends BaseMysqlRepo implements IUserRepository {

    public create = (u: UserCreate): ResultAsync<void, Err> => {
        const query = `INSERT INTO user (user_name, first_name, last_name, system_role)
                       VALUES (?, ?, ?, ?) `;

        return ResultAsync.fromPromise(this.executeQuery(query,
            [u.userName, u.firstName, u.lastName, u.systemRole.toString()],
        ).andThen(
            ([r, f]) => {
                const header = r as ResultSetHeader
                u.id = header.insertId;
                return ok(undefined)
            }
        ), e => MysqlErrHandler.handler(err, UserEntityName)).andThen(r => r);
    }

    public findByUserId = (id: number): ResultAsync<User | null, Err> => {
        const query = `SELECT *
                       FROM user
                       WHERE id = ? LIMIT 1`;
        return ResultAsync.fromPromise(this.executeQuery(query, [id],)
            .andThen(([r, f]) => {
                    const a = r as RowDataPacket[]
                    if (a.length <= 0) {
                        return ok(null)
                    }
                    const data: User = SqlHelper.toCamelCase(a[0]);
                    return ok(data)
                }
            ), e => MysqlErrHandler.handler(err, UserEntityName)).andThen(r => r);

    }

    public hardDeleteById(id: number): ResultAsync<void, Err> {
        const query = `DELETE
                       FROM user
                       WHERE id = ?`;
        return ResultAsync.fromPromise(this.executeQuery(query, [id]).andThen(([r, f]) => {
            const header = r as ResultSetHeader;
            return ok(undefined)
        }), e => e as Err).andThen(r => r);
    }

    public findByCondition = (cond: ICondition, paging: Paging): ResultAsync<User[], Err> => {

        const [whereClause, values] = SqlHelper.buildWhereClause(cond)
        const query = `SELECT *
                       FROM user ${whereClause}`;

        return ResultAsync.fromPromise(
            this.executeQuery(query, values).andThen(
                ([r, f]) => {
                    const rows = r as RowDataPacket[]
                    const data: User[] = []
                    if (rows && rows.length > 0) {
                        data.push(SqlHelper.toCamelCase(rows[0]) as User);
                        paging.total = rows.length;
                    }
                    return ok(data)
                }
            ), e => MysqlErrHandler.handler(err, UserEntityName)).andThen(r => r);
    }
}