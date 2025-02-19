import {ok, okAsync, ResultAsync} from "neverthrow";
import {Err} from "../../../libs/errors";
import {Paging} from "../../../libs/paging";
import {Audit} from "../entity/audit";
import {IAuditRepository} from "./IAuditRepository";
import {RowDataPacket} from "mysql2";
import {SqlHelper} from "../../../libs/sqlHelper";
import {injectable} from "inversify";
import {BaseMysqlRepo} from "../../../components/mysql/BaseMysqlRepo";

@injectable()
export class AuditMysqlRepo extends BaseMysqlRepo implements IAuditRepository {
    create(u: Audit): ResultAsync<void, Err> {
        const query = `INSERT INTO audit_log (user_id, action, object_type, object_id, old_values, new_values,
                                              ip_address, user_agent)
                           VALUE (?, ?, ?, ?, ?, ?, ?, ?)`

        return this.executeQuery(query,
                [u.userId, u.action, u.objectType, u.objectId, JSON.stringify(u.oldValues), JSON.stringify(u.newValues), u.ipAddress, u.userAgent])
                .andThen(r => okAsync(undefined))
    }

    list(condition: any, paging: Paging): ResultAsync<Audit[], Err> {
        const [whereClause, values] = SqlHelper.buildWhereClause(condition,"audit_log");
        const offset = (paging.page - 1) * paging.limit;
        const limit = paging.limit;
        const cursor = paging.cursor;

        const query = `SELECT audit_log.*, user.last_name, user.first_name FROM audit_log  LEFT OUTER JOIN    user  ON user_id = user.id  ${whereClause} ${cursor ? 'AND audit_log.id < ?' : ''}
                      ORDER BY audit_log.id DESC LIMIT ? ${cursor ? '' : 'OFFSET ?'}
                      `
        const pagingValue = cursor ? [cursor,limit] : [limit,offset];
        return this.executeQuery(`SELECT COUNT(*) as total
                               FROM audit_log ${whereClause}`, values)
                // total
                .andThen(([r, f]) => {
                    const firstRow = (r as RowDataPacket[])[0];
                    if (!firstRow) {
                        return ok({total: 0});
                    }
                    paging.total = firstRow.total
                    return ok({total: firstRow.total});
                })
                // select many
                .andThen((r) => {
                    if (r.total == 0) {
                        return ok([])
                    }
                    return this.executeQuery(query, [...values,...pagingValue])
                        .andThen(([r, f]) => {
                            const audits = (r as RowDataPacket[]).map(row =>{
                                const camel =  SqlHelper.toCamelCase(row)

                                return {
                                    action: camel.action,
                                    createdAt: camel.createdAt,
                                    id: camel.id,
                                    ipAddress: camel.ipAddress,
                                    newValues: camel.newValues,
                                    objectId: camel.objectId,
                                    objectType: camel.objectType,
                                    oldValues: camel.oldValues,
                                    user: {
                                        firstName: camel.firstName,
                                        lastName : camel.lastName,
                                    },
                                    userAgent: camel.userAgent,
                                    userId: camel.userId,
                                } as Audit
                            });

                            if (audits.length > 0) {
                                paging.nextCursor =   audits[audits.length - 1].id
                            }
                            return ok(audits)
                        })
                })
    }
}