import {ICustomerRepository} from "./ICustomerRepository";
import {BaseMysqlRepo} from "../../../components/mysql/BaseMysqlRepo";
import {errAsync, ok, okAsync, ResultAsync} from "neverthrow";
import {CustomerCreate} from "../entity/customerCreate";
import {createDatabaseError, createEntityNotFoundError, Err} from "../../../libs/errors";
import {ResultSetHeader, RowDataPacket} from "mysql2";
import {CustomerUpdate} from "../entity/customerUpdate";
import {SqlHelper} from "../../../libs/sqlHelper";
import {Customer} from "../entity/customer";
import {CustomerFilter} from "../entity/customerFilter";
import {Paging} from "../../../libs/paging";

export class CustomerMysqlRepo extends BaseMysqlRepo implements ICustomerRepository {
    create(c: CustomerCreate): ResultAsync<Customer, Err> {
        const query = `INSERT INTO customer (phone_number, address, first_name, last_name, date_of_birth, gender) VALUES (?, ?, ?, ?, ?, ?)`;
        return this.executeQuery(query,
            [c.phoneNumber, c.address, c.firstName, c.lastName, c.dateOfBirth, c.gender]
        ).andThen(
            ([r, f]) => {
                const header = r as ResultSetHeader;
                c.id = header.insertId;
                const createdCustomer: Customer = {
                    id: header.insertId,
                    phoneNumber: c.phoneNumber,
                    address: c.address,
                    firstName: c.firstName,
                    lastName: c.lastName,
                    dateOfBirth: c.dateOfBirth,
                    paymentAmount: 0,
                    gender: c.gender,
                    discountPoint: 0,
                    status: 1,
                }
                return okAsync(createdCustomer);
            });
    }

    update(id: number, c: CustomerUpdate): ResultAsync<Customer, Err> {
        const [clause, values] = SqlHelper.buildUpdateClause(c);
        const query = `UPDATE customer SET ${clause} WHERE id = ?`;
        return this.executeQuery(query, [...values, id]).andThen(
            ([r, f]) => {
                const header = r as ResultSetHeader;

                // Check if any rows were affected
                if (header.affectedRows === 0) {
                    return errAsync(createDatabaseError("Customer not found or no changes made"));
                }

                const selectQuery = `SELECT * FROM customer WHERE id = ?`;
                return this.executeQuery(selectQuery, [id]).andThen(([r]) => {
                    const fetchedRows = r as Customer[];

                    if (fetchedRows.length === 0) {
                        return errAsync(createDatabaseError("Customer not found after update"));
                    }

                    return okAsync(fetchedRows[0]);
                });
            });
    }

    delete(id: number): ResultAsync<void, Err> {
        const query = `UPDATE customer SET status = 0 WHERE id = ?`;
        return this.executeQuery(query, [id]).andThen(
            ([r, f]) => {
                const header = r as ResultSetHeader;
                return okAsync(undefined);
            });
    }

    findById(id: number): ResultAsync<Customer, Err> {
        const query = `SELECT * FROM customer WHERE id = ?`;
        return this.executeQuery(query, [id]).andThen(
            ([r, f]) => {
                const rows = r as Customer[];
                if (rows.length === 0) {
                    return errAsync(createEntityNotFoundError("Customer"));
                }
                return okAsync(SqlHelper.toCamelCase(rows[0]));
            });
    }

    list(cond: CustomerFilter, page: Paging): ResultAsync<Customer[], Err> {
        const [whereClause, whereValues] = SqlHelper.buildWhereClause(cond);
        const pagingClause = SqlHelper.buildPaginationClause(page);
        const query = `SELECT * FROM customer ${whereClause} ${pagingClause}`;
        console.log(cond);
        console.log(query);
        const countQuery = `SELECT COUNT(id) FROM customer ${whereClause}`;
        return this.executeQuery(countQuery, whereValues).andThen(
            ([r, f]) => {
                const firstRow = (r as RowDataPacket[])[0];
                if (!firstRow) {
                    return okAsync({total: 0});
                }
                page.total = firstRow.total;
                return okAsync({total: firstRow.total});
            }
        ).andThen(
            (r) => {
                if (r.total === 0) {
                    return okAsync([]);
                } else {
                    return this.executeQuery(query, whereValues).andThen(
                        ([r, f]) => {
                            const data = (r as RowDataPacket[]).map(row => SqlHelper.toCamelCase(row) as Customer);
                            return okAsync(data);
                        }
                    )
                }
            });
    }

    increasePaymentAmount(userId: number,discountPoint : number): ResultAsync<void, Err> {
        const query = `UPDATE customer SET payment_amount = payment_amount + 1, discount_point = ? WHERE id = ? `;
        return this.executeQuery(query, [discountPoint,userId]).andThen(
            ([r, f]) => {
                const header = r as ResultSetHeader;
                return okAsync(undefined);
            });
    }
}