import {ICustomerRepository} from "./ICustomerRepository";
import {BaseMysqlRepo} from "../../../components/mysql/BaseMysqlRepo";
import {okAsync, ResultAsync} from "neverthrow";
import {CustomerCreate} from "../entity/customerCreate";
import {Err} from "../../../libs/errors";
import {ResultSetHeader} from "mysql2";
import {CustomerUpdate} from "../entity/customerUpdate";
import {SqlHelper} from "../../../libs/sqlHelper";

export class CustomerMysqlRepo extends BaseMysqlRepo implements ICustomerRepository {
    create(c: CustomerCreate): ResultAsync<void, Err> {
        const query = `INSERT INTO customer (phone_number, address, first_name, last_name, date_of_birth, gender) VALUES (?, ?, ?, ?, ?, ?)`;
        return this.executeQuery(query,
            [c.phoneNumber, c.address, c.firstName, c.lastName, c.dateOfBirth, c.gender]
        ).andThen(
            ([r, f]) => {
                const header = r as ResultSetHeader;
                c.id = header.insertId;
                return okAsync(undefined);
            });
    }

    update(id: number, c: CustomerUpdate): ResultAsync<void, Err> {
        const [clause, values] = SqlHelper.buildUpdateClause(c);
        const query = `UPDATE customer SET ${clause} WHERE id = ?`;
        return this.executeQuery(query, [...values, id]).andThen(
            ([r, f]) => {
                const header = r as ResultSetHeader;
                return okAsync(undefined);
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
}