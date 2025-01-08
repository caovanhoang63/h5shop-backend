import {ResultSetHeader, RowDataPacket} from "mysql2";
import {UserCreate} from "../../entity/userCreate";
import {ICondition} from "../../../../libs/condition";
import {User, UserEntityName} from "../../entity/user";
import {SqlHelper} from "../../../../libs/sqlHelper";
import {Paging} from "../../../../libs/paging";
import {MysqlErrHandler} from "../../../../libs/mysqlErrHandler";
import {err, ok, okAsync, ResultAsync} from "neverthrow";
import {Err} from "../../../../libs/errors";
import {IUserRepository} from "../IUserRepository";
import {BaseMysqlRepo} from "../../../../components/mysql/BaseMysqlRepo";
import {EmployeeUpdate} from "../../../employee/entity/employee";
import {UserUpdate} from "../../entity/userUpdate";

export class UserMysqlRepo extends BaseMysqlRepo implements IUserRepository {

    public create = (u: UserCreate): ResultAsync<void, Err> => {
        const query = `
            INSERT INTO user ( user_name, first_name, last_name, system_role,phone_number, email, address, date_of_birth)
            VALUES (?,?,?,?,?,?,?,?)
                       `;

        return this.executeQuery(query,
            [u.userName, u.firstName, u.lastName, u.systemRole.toString(),u.phoneNumber,u.email,u.address,u.dateOfBirth],
        ).andThen(
            ([r, f]) => {
                const header = r as ResultSetHeader
                u.id = header.insertId;
                return ok(undefined)
            })
    }

    public findByUserId = (id: number): ResultAsync<User | null, Err> => {
        const query = `SELECT *
                       FROM user
                       WHERE id = ? LIMIT 1`;
        return this.executeQuery(query, [id],)
            .andThen(([r, f]) => {
                    const a = r as RowDataPacket[]
                    if (a.length <= 0) {
                        return ok(null)
                    }
                    const data: User = SqlHelper.toCamelCase(a[0]);
                    return ok(data)
                })
    }

    update(id: number, userUpdate: UserUpdate): ResultAsync<void, Error> {
        const [clause, values] = SqlHelper.buildUpdateClause(userUpdate)
        const query = `UPDATE user
                       SET ${clause}
                       WHERE id = ? `;
        return this.executeQuery(query, [...values, id]).andThen(
            ([r, f]) => {
                const header = r as ResultSetHeader;
                return okAsync(undefined)
            }
        );
    }

    public hardDeleteById(id: number): ResultAsync<void, Err> {
        const query = `DELETE
                       FROM user
                       WHERE id = ?`;
        return this.executeQuery(query, [id]).andThen(([r, f]) => {
            const header = r as ResultSetHeader;
            return ok(undefined)
        })
    }

    public findByCondition = (cond: ICondition, paging: Paging): ResultAsync<User[], Err> => {

        const [whereClause, values] = SqlHelper.buildWhereClause(cond)
        const query = `SELECT *
                       FROM user ${whereClause} order by id DESC `;

        return this.executeQuery(query, values).andThen(
                ([r, f]) => {
                    const rows = r as RowDataPacket[]
                    return ok(rows.map(row => SqlHelper.toCamelCase(row)))
                })
    }
}