import {ResultSetHeader, RowDataPacket} from "mysql2";
import {Auth} from "../../entity/auth";
import {SqlHelper} from "../../../../libs/sqlHelper";
import {IAuthRepository} from "../IAuthRepository";
import {ok, ResultAsync} from "neverthrow";
import {AuthChangePassword, AuthCreate} from "../../entity/authCreate";
import {createDatabaseError, Err} from "../../../../libs/errors";
import {BaseMysqlRepo} from "../../../../components/mysql/BaseMysqlRepo";

export class AuthMysqlRepo extends BaseMysqlRepo implements IAuthRepository {
    changePassword(userId: number, u: AuthChangePassword): ResultAsync<void, Error> {
        const query = `UPDATE auth SET password = ?, salt = ? WHERE user_id = ?`
        return this.executeQuery(query,[u.password,u.salt,userId])
            .andThen(() => {
                return ok(undefined)}
            )
    }
    Create = (u: AuthCreate): ResultAsync<void, Err> => {
        const query = `INSERT INTO auth (user_id, user_name, salt, password)
                       VALUES (?, ?, ?, ?)`
        return this.executeQuery(query, [u.userId, u.userName, u.salt, u.password])
            .andThen(([row, field]) => {
                const header = row as ResultSetHeader
                u.id = header.insertId
                return ok(undefined)})
    }

    FindByUserName = (userName: string): ResultAsync<Auth | null, Err> => {
        const query = `SELECT *
                       FROM auth
                       WHERE user_name = ? LIMIT 1`;
        return this.executeQuery(query, [userName],)
            .andThen(([r, f]) => {
                const a = r as RowDataPacket[]
                if (a.length <= 0) {
                    return ok(null)
                }
                const data: Auth = SqlHelper.toCamelCase(a[0]);
                return ok(data)})
    }

    FindByUserId = (userId: number): ResultAsync<Auth | null, Err> => {
        const query = `SELECT *
                       FROM auth
                       WHERE user_id = ? LIMIT 1`;
        return this.executeQuery(query, [userId],)
            .andThen(([r, f]) => {
                const a = r as RowDataPacket[]
                if (a.length <= 0) {
                    return ok(null)
                }
                const data: Auth = SqlHelper.toCamelCase(a[0]);
                return ok(data)
            })
    }
}