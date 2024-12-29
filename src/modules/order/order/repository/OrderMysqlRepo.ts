import {IOrderRepository} from "./IOrderRepository";
import {BaseMysqlRepo} from "../../../../components/mysql/BaseMysqlRepo";
import {okAsync, ResultAsync} from "neverthrow";
import {OrderCreate} from "../entity/orderCreate";
import {Err} from "../../../../libs/errors";
import {ResultSetHeader} from "mysql2";
import {OrderUpdate} from "../entity/orderUpdate";
import {SqlHelper} from "../../../../libs/sqlHelper";

export class OrderMysqlRepo extends BaseMysqlRepo implements IOrderRepository {
    create(o: OrderCreate): ResultAsync<void, Err> {
        const query = `INSERT INTO \`order\` (customer_id, seller_id, order_type, description) VALUES (?, ?, ?, ?)`;
        return this.executeQuery(query,
            [o.customerId, o.sellerId, o.orderType, o.description]
        ).andThen(
            ([r, f]) => {
                const header = r as ResultSetHeader;
                o.id = header.insertId;
                return okAsync(undefined);
            });
    }

    update(id: number, o: OrderUpdate): ResultAsync<void, Err> {
        const [clause, values] = SqlHelper.buildUpdateClause(o);
        const query = `UPDATE \`order\` SET ${clause} WHERE id = ?`;
        return this.executeQuery(query, [...values, id]).andThen(
            ([r, f]) => {
                const header = r as ResultSetHeader;
                return okAsync(undefined);
            });
    }

    delete(id: number): ResultAsync<void, Err> {
        const query = `UPDATE \`order\` SET status = 0 WHERE id = ?`;
        return this.executeQuery(query, [id]).andThen(
            ([r, f]) => {
                const header = r as ResultSetHeader;
                return okAsync(undefined);
            });
    }
}