import mysql, {RowDataPacket} from "mysql2";
import {AuthCreate} from "../../entity/authVar";
import {Auth} from "../../entity/auth";
import {SqlHelper} from "../../../../libs/sqlHelper";
import {IAuthRepository} from "../IAuthRepository";
import {Err, newDBError} from "../../../../libs/errors";
import {ok, ResultAsync} from "neverthrow";

export class AuthMysqlRepo implements IAuthRepository {
    constructor(private readonly pool: mysql.Pool) {
    }

    Create = (u: AuthCreate): ResultAsync<void, Err> => {
        const query = `INSERT INTO auth (user_id, user_name, salt, password)
                       VALUES (?, ?, ?, ?)`
        return ResultAsync.fromPromise(this.pool.promise().query(query, [u.userId, u.userName, u.salt, u.password])
            .then(([row, field]) => {
                console.log(row)
                return ok(undefined)
            }), e => newDBError(e)
        ).andThen(r => r)
    }

    FindByUserName = (userName: string): ResultAsync<Auth | null, Err> => {
        const query = `SELECT *
                       FROM auth
                       WHERE user_name = ?
                       LIMIT 1`;
        return ResultAsync.fromPromise(this.pool.promise().query(query, [userName],)
            .then(([r, f]) => {
                const a = r as RowDataPacket[]
                if (a.length <= 0) {
                    return ok(null)
                }
                const data: Auth = SqlHelper.toCamelCase(a[0]);
                return ok(data)

            }), e => newDBError(e)
        ).andThen(r => r)
    }


    FindByUserId = (userId: number): ResultAsync<Auth | null, Err> => {
        const query = `SELECT *
                       FROM auth
                       WHERE user_id = ?
                       LIMIT 1`;
        return ResultAsync.fromPromise(this.pool.promise().query(query, [userId],)
            .then(([r, f]) => {
                const a = r as RowDataPacket[]
                if (a.length <= 0) {
                    return ok(null)
                }
                const data: Auth = SqlHelper.toCamelCase(a[0]);
                return ok(data)
            }), e => newDBError(e)
        ).andThen(r => r)
    }
}