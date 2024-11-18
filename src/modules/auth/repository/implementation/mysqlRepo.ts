import mysql, {ResultSetHeader, RowDataPacket} from "mysql2";
import {Auth} from "../../entity/auth";
import {SqlHelper} from "../../../../libs/sqlHelper";
import {IAuthRepository} from "../IAuthRepository";
import {ok, ResultAsync} from "neverthrow";
import {AuthCreate} from "../../entity/authCreate";
import {createDatabaseError, Err} from "../../../../libs/errors";
import {BaseMysqlRepo} from "../../../../components/mysql/BaseMysqlRepo";

export class AuthMysqlRepo extends BaseMysqlRepo implements IAuthRepository {
    Create = (u: AuthCreate): ResultAsync<void, Err> => {
        const query = `INSERT INTO auth (user_id, user_name, salt, password)
                       VALUES (?, ?, ?, ?)`
        return ResultAsync.fromPromise(this.executeQuery(query, [u.userId, u.userName, u.salt, u.password])
            .andThen(([row, field]) => {
                const header = row as ResultSetHeader
                u.id = header.insertId
                return ok(undefined)
            }), e => createDatabaseError(e)
        ).andThen(r => r)
    }

    FindByUserName = (userName: string): ResultAsync<Auth | null, Err> => {
        const query = `SELECT *
                       FROM auth
                       WHERE user_name = ?
                       LIMIT 1`;
        return ResultAsync.fromPromise(this.executeQuery(query, [userName],)
            .andThen(([r, f]) => {
                const a = r as RowDataPacket[]
                if (a.length <= 0) {
                    return ok(null)
                }
                const data: Auth = SqlHelper.toCamelCase(a[0]);
                return ok(data)

            }), e => createDatabaseError(e)
        ).andThen(r => r)
    }

    FindByUserId = (userId: number): ResultAsync<Auth | null, Err> => {
        const query = `SELECT *
                       FROM auth
                       WHERE user_id = ?
                       LIMIT 1`;
        return ResultAsync.fromPromise(this.executeQuery(query, [userId],)
            .andThen(([r, f]) => {
                const a = r as RowDataPacket[]
                if (a.length <= 0) {
                    return ok(null)
                }
                const data: Auth = SqlHelper.toCamelCase(a[0]);
                return ok(data)
            }), e => createDatabaseError(e)
        ).andThen(r => r)
    }
}