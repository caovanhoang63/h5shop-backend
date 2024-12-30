import {BaseMysqlRepo} from "../../../../components/mysql/BaseMysqlRepo";
import {IOrderItemRepository} from "./IOrderItemRepository";
import {OrderItemCreate} from "../entity/orderItemCreate";
import {Err} from "../../../../libs/errors";
import {errAsync, okAsync, ResultAsync} from "neverthrow";
import {ResultSetHeader, RowDataPacket} from "mysql2";
import {OrderItemUpdate} from "../entity/orderItemUpdate";

export class OrderItemMysqlRepo extends BaseMysqlRepo implements IOrderItemRepository{
    create(o: OrderItemCreate): ResultAsync<void, Err> {
        const getPriceQuery = `SELECT price FROM sku WHERE id = ? AND status = 1`;
        return this.executeQuery(getPriceQuery, [o.skuId]).andThen(([rows, _]) => {
            const result = rows as RowDataPacket[];

            const unitPrice = result[0].price;

            const insertQuery = `
            INSERT INTO order_item (order_id, sku_id, amount, description, unit_price, discount)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

            return this.executeQuery(insertQuery,
                [o.orderId, o.skuId, o.amount, o.description, unitPrice, o.discount]
            ).andThen(([r, f]) => {
                const header = r as ResultSetHeader;
                o.id = header.insertId;
                return okAsync(undefined);
            });
        });
    }

    update(orderId: number, skuId: number, o: OrderItemUpdate): ResultAsync<void, Err> {
        const query = `UPDATE order_item SET amount = ?, description = ?, unit_price = ?, discount = ? WHERE order_id = ? AND sku_id = ?`;
        return this.executeQuery(query,
            [o.amount, o.description, o.unitPrice, o.discount, orderId, skuId]
        ).andThen(
            ([r, f]) => {
                return okAsync(undefined);
            });
    }

    delete(orderId: number, skuId: number): ResultAsync<void, Err> {
        const query = `DELETE FROM order_item WHERE order_id = ? AND sku_id = ?`;
        return this.executeQuery(query, [orderId, skuId]).andThen(
            ([r, f]) => {
                return okAsync(undefined);
            });
    }
}