import mysql, {ResultSetHeader, RowDataPacket} from "mysql2";
import {UserCreate} from "../../entity/userVar";
import {ICondition} from "../../../../libs/condition";
import {User, UserEntityName} from "../../entity/user";
import {SqlHelper} from "../../../../libs/sqlHelper";
import {Paging} from "../../../../libs/paging";
import {MysqlErrHandler} from "../../../../libs/mysqlErrHandler";
import {err, errAsync, ok, okAsync, ResultAsync} from "neverthrow";
import {AppError} from "../../../../libs/errors";

export class UserMysqlRepo {
    private readonly pool: mysql.Pool;

    constructor(pool: mysql.Pool) {
        this.pool = pool
    }

    public Create = (u: UserCreate):  ResultAsync<void,AppError> => {
        const query = `INSERT INTO user (user_name, first_name, last_name, system_role)
                       VALUES (?, ?, ?, ?) `;

        return ResultAsync.fromPromise(this.pool.promise().query(query,
            [u.userName, u.firstName, u.lastName, u.systemRole.toString()],
        ).then(
            ([r, f]) => {
                const header = r as ResultSetHeader
                u.id = header.insertId;
                return ok(undefined)
            }
        ), e => MysqlErrHandler.handler(err, UserEntityName)).andThen(r => r);
    }

    public FindByUserId = (id: number): ResultAsync<User |null,AppError> => {
        const query = `SELECT *
                       FROM user
                       WHERE id = ? LIMIT 1`;
        return ResultAsync.fromPromise(this.pool.promise().query(query, [id],)
            .then(([r, f]) => {
                const a = r as RowDataPacket[]
                if (a.length <= 0) {
                    return ok(null)
                }
                const data: User = SqlHelper.toCamelCase(a[0]);
                return ok(data)

            }
            ), e => MysqlErrHandler.handler(err, UserEntityName)).andThen(r => r);

    }


    public FindByCondition = (cond: ICondition, paging: Paging): ResultAsync<User[],AppError> => {

        const [whereClause, values] = SqlHelper.buildWhereClause(cond)
        const query = `SELECT *
                       FROM user ${whereClause}`;
        this.pool.query(query,)
        return ResultAsync.fromPromise(
            this.pool.promise().query(query, values).then(
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