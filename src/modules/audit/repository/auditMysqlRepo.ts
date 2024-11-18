import {ok, ResultAsync} from "neverthrow";
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
        return ResultAsync.fromPromise(
            this.executeQuery(query,
                [u.userId, u.action, u.objectType, u.objectId, JSON.stringify(u.oldValues), JSON.stringify(u.newValues), u.ipAddress, u.userAgent])
                .then(),
            e => e as Err
        )

    }

    list(condition: any, paging: Paging): ResultAsync<Audit[], Err> {
        const [whereClause, values] = SqlHelper.buildWhereClause(condition);
        const offset = (paging.page - 1) * paging.limit;
        const limit = paging.limit;
        return ResultAsync.fromPromise(
            this.executeQuery(`SELECT COUNT(*) as total
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
                    return this.executeQuery(`SELECT *
                                              FROM audit_log ${whereClause}
                                              ORDER BY created_at DESC
                                              LIMIT ? OFFSET ?`, [...values, limit, offset])
                        .andThen(([r, f]) => {
                            const audits = (r as RowDataPacket[]).map(row => SqlHelper.toCamelCase(row) as Audit);
                            return ok(audits)
                        })
                }),
            e => e as Err)
            // map return value
            .andThen(r => r)

    }
}