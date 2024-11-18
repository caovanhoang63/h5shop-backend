import {errAsync, ok, okAsync, ResultAsync} from "neverthrow";
import {createDatabaseError, Err} from "../../../libs/errors";
import {Paging} from "../../../libs/paging";
import {Audit} from "../entity/audit";
import {IAuditRepository} from "./IAuditRepository";
import conPool from "../../../mysql";
import {ResultSetHeader, RowDataPacket} from "mysql2";
import {SqlHelper} from "../../../libs/sqlHelper";
import {PoolConnection} from "mysql2/promise";
import {injectable} from "inversify";

@injectable()
export class AuditMysqlRepo implements IAuditRepository {
    private _conn? : PoolConnection;
    constructor() {
        conPool.promise().getConnection().then(connection => {this._conn = connection})
    }

    create(u: Audit): ResultAsync<void, Err> {
        if (!this._conn) {
            return errAsync(createDatabaseError())
        }
        const query = `INSERT INTO audit_log (user_id, action, object_type, object_id, old_values, new_values, ip_address, user_agent)
                        VALUE (?,?,?,?,?,?,?,?)`
        return ResultAsync.fromPromise(
            this._conn.query(query,[u.userId,u.action,u.objectType,u.objectId,JSON.stringify(u.oldValues),JSON.stringify(u.newValues),u.ipAddress,u.userAgent]).then(
                ([r,f]) => {
                    const header = r as ResultSetHeader
                    return ok(undefined)
                }
            ),
            e => createDatabaseError(e)
        ).andThen(r=>r)
    }
    list(condition: any, paging: Paging): ResultAsync<Audit[], Err> {
        if (!this._conn) {
             return errAsync(createDatabaseError())
        }
        const [whereClause, values] = SqlHelper.buildWhereClause(condition);
        const offset = (paging.page - 1) * paging.limit;
        const limit = paging.limit;
        return ResultAsync.fromPromise(
                this._conn!.query(
                    `SELECT COUNT(*) as total FROM audit_log ${whereClause}`,
                    values
                ).then(([rows]) => {
                    const firstRow = (rows as RowDataPacket[])[0];
                    if (!firstRow) {
                        return ok({ total: 0 });
                    }
                    return ok({ total: firstRow.total });
                }),
                e => createDatabaseError(e)
        ).andThen(result => {
            paging.total = result.value.total;
            return ResultAsync.fromPromise(
                this._conn!.query(
                    `SELECT * FROM audit_log ${whereClause} 
                 ORDER BY created_at DESC 
                 LIMIT ? OFFSET ?`,
                    [...values, limit, offset]
                ).then(([rows]) => {
                    const audits = (rows as RowDataPacket[]).map(row =>
                        SqlHelper.toCamelCase(row) as Audit
                    );
                    return audits;
                }).finally( () => {this._conn?.release()}),
                e => createDatabaseError(e)
            );
        })
    }
}