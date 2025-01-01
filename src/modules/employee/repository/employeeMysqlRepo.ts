import {BaseMysqlRepo} from "../../../components/mysql/BaseMysqlRepo";
import {IEmployeeRepository} from "./IEmployeeRepository";
import {Employee, EmployeeCreate, EmployeeUpdate} from "../entity/employee";
import {ok, okAsync, ResultAsync} from "neverthrow";
import {ICondition} from "../../../libs/condition";
import {Paging} from "../../../libs/paging";
import {ResultSetHeader, RowDataPacket} from "mysql2";
import {SqlHelper} from "../../../libs/sqlHelper";
import {Provider} from "../../provider/entity/provider";
import {Err} from "../../../libs/errors";

export class EmployeeMysqlRepo extends BaseMysqlRepo implements IEmployeeRepository {
    create(employeeCreate: EmployeeCreate): ResultAsync<void, Error> {
        const query = `INSERT INTO employee (first_name, last_name, email, phone_number, address, date_of_birth)
                       VALUES (?, ?, ?, ?, ?, ?)`;
        return this.executeQuery(query, [employeeCreate.firstName, employeeCreate.lastName, employeeCreate.email, employeeCreate.phoneNumber, employeeCreate.address, employeeCreate.dateOfBirth])
            .andThen(([r, f]) => {
                const header = r as ResultSetHeader;
                return okAsync(undefined);
            });
    }

    delete(id: number): ResultAsync<void, Error> {
        const query = `UPDATE employee
                       SET STATUS = 0
                       WHERE id = ? `;
        return this.executeQuery(query, [id]).andThen(
            ([r, f]) => {
                const header = r as ResultSetHeader;
                return okAsync(undefined)
            }
        );
    }

    findById(id: number): ResultAsync<Employee | null, Err> {
        const query = `SELECT *
                       FROM employee
                       WHERE id = ? LIMIT 1`;
        return this.executeQuery(query, [id]).andThen(
            ([r, f]) => {
                const firstRow = (r as RowDataPacket[])[0];
                if (!firstRow) {
                    return ok(null);
                } else {
                    return ok(SqlHelper.toCamelCase(firstRow) as Employee);
                }
            }
        )
    }

    update(id: number, employeeUpdate: EmployeeUpdate): ResultAsync<void, Error> {
        const [clause, values] = SqlHelper.buildUpdateClause(employeeUpdate)
        const query = `UPDATE employee
                       SET ${clause}
                       WHERE id = ? `;
        return this.executeQuery(query, [...values, id]).andThen(
            ([r, f]) => {
                const header = r as ResultSetHeader;
                return okAsync(undefined)
            }
        );
    }

    list(cond: ICondition, paging: Paging): ResultAsync<Employee[] | null, Err> {
        const time = Date.now()
        const [clause, values] = SqlHelper.buildWhereClause(cond)
        console.log(Date.now() - time)
        const pagingClause = SqlHelper.buildPaginationClause(paging)
        const countQuery = `SELECT COUNT(*) as total
                            FROM provider ${clause}`;
        const query = `SELECT *
                       FROM employee ${clause} ${pagingClause}`;
        return this.executeQuery(countQuery, values).andThen(
            ([r, f]) => {
                const firstRow = (r as RowDataPacket[])[0];
                if (!firstRow) {
                    return okAsync({total: 0});
                }
                paging.total = firstRow.total;
                return ok({total: firstRow.total});
            }
        ).andThen(
            (r) => {
                if (r.total == 0)
                    return ok([]);
                else
                    return this.executeQuery(query, values).andThen(
                        ([r, f]) => {
                            const data = (r as RowDataPacket[]).map(row => SqlHelper.toCamelCase(row) as Employee);
                            return ok(data)
                        }
                    )
            })
    }


}
