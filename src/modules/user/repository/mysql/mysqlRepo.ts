import mysql, {ResultSetHeader, RowDataPacket} from "mysql2";
import {UserCreate} from "../../entity/userVar";
import {Err, Ok} from "../../../../libs/result";
import {ICondition} from "../../../../libs/condition";
import {User, UserEntityName} from "../../entity/user";
import {SqlHelper} from "../../../../libs/sqlHelper";
import {Paging} from "../../../../libs/paging";
import {ResultAsync} from "../../../../libs/resultAsync";
import {MysqlErrHandler} from "../../../../libs/mysqlErrHandler";

export class UserMysqlRepo {
    private readonly pool: mysql.Pool;

    constructor(pool: mysql.Pool) {
        this.pool = pool
    }

    public Create = (u: UserCreate): ResultAsync<void> => {
        const query = `INSERT INTO user (user_name, first_name, last_name, system_role)
                       VALUES (?, ?, ?, ?) `;
        return ResultAsync.fromPromise(this.pool.promise().query(query,
            [u.userName, u.firstName, u.lastName, u.systemRole.toString()],
        ).then(
            ([r, f]) => {
                const header = r as ResultSetHeader
                u.id = header.insertId;
                return Ok<void>(undefined);
            }
        ).catch((err: any) => {
            return Err<void>(MysqlErrHandler.handler(err, UserEntityName))
        }))
    }

    public FindByUserId = (id: number): ResultAsync<User> => {
        const query = `SELECT *
                       FROM user
                       WHERE id = ? LIMIT 1`;
        return ResultAsync.fromPromise(this.pool.promise().query(query, [id],)
            .then(([r, f]) => {
                const a = r as RowDataPacket[]
                if (a.length <= 0) {
                    return Ok<User>()
                }
                const data: User = SqlHelper.toCamelCase(a[0]);
                return Ok<User>(data)

            })
            .catch(
                e => Err<User>(e)
            )
        )

    }


    public FindByCondition = (cond: ICondition, paging: Paging): ResultAsync<User[]> => {
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
                    return Ok(data)
                }
            ).catch((err: any) => {
                return Err<User[]>(MysqlErrHandler.handler(err, UserEntityName))
            })
        )
    }
}