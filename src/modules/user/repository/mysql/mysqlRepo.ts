import mysql, {ResultSetHeader, RowDataPacket} from "mysql2";
import {UserCreate} from "../../entity/userVar";
import {Err, Ok} from "../../../../libs/result";
import {ICondition} from "../../../../libs/condition";
import {User} from "../../entity/user";
import {SqlHelper} from "../../../../libs/sqlHelper";
import {Paging} from "../../../../libs/paging";
import {ResultAsync} from "../../../../libs/resultAsync";

export class UserMysqlRepo {
    private readonly pool: mysql.Pool;
    constructor(pool : mysql.Pool) {
        this.pool = pool
    }

    public Create = (u : UserCreate) : ResultAsync<void> => {
        const query = `INSERT INTO user (first_name,last_name,system_role) VALUES (?, ? , ? ) `;
        return ResultAsync.fromPromise(this.pool.promise().query(query,
            [u.firstName,u.lastName,u.systemRole.toString()],
        ).then(
            ([r,f]) => {
                const a = r as ResultSetHeader
                u.id = a.insertId;
                return Ok<void>(undefined);
            }
        ).catch((err) => {
            return Err<any>(err)
        }))
    }

    public FindByCondition = (cond: ICondition, paging: Paging): ResultAsync<User[]> => {
        const [whereClause, values] = SqlHelper.BuildWhereClause(cond)
        const query = `SELECT * FROM user ${whereClause}`;
        return ResultAsync.fromPromise(
            this.pool.promise().query(query, values).then(
                ([r, f]) => {
                    const a = r as RowDataPacket[]
                    const data :User[] = []
                    if (a && Array.isArray(a) && a.length > 0) {
                        const camelCaseUser = SqlHelper.ConvertKeysToCamelCase(a[0]);
                        data.push(camelCaseUser as User);
                    }
                    paging.total = a.length;
                    return Ok(data)
                }
            ).catch((err) => {
                return Err<User[]>(err)
            })
        )
    }
}