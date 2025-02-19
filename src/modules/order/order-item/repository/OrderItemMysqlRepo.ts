import {BaseMysqlRepo} from "../../../../components/mysql/BaseMysqlRepo";
import {IOrderItemRepository} from "./IOrderItemRepository";
import {OrderItemCreate} from "../entity/orderItemCreate";
import {createDatabaseError, Err} from "../../../../libs/errors";
import {errAsync, okAsync, ResultAsync} from "neverthrow";
import {ResultSetHeader, RowDataPacket} from "mysql2";
import {OrderItemUpdate} from "../entity/orderItemUpdate";
import {OrderItem} from "../entity/orderItem";
import {Order} from "../../order/entity/order";
import {SqlHelper} from "../../../../libs/sqlHelper";

export class OrderItemMysqlRepo extends BaseMysqlRepo implements IOrderItemRepository{
    create(o: OrderItemCreate): ResultAsync<OrderItem, Err> {
        const insertQuery = `
            INSERT INTO order_item (order_id, sku_id, amount, description, unit_price)
            VALUES (?, ?, ?, ?, ?) 
            ON DUPLICATE  KEY UPDATE
                amount = VALUES(amount),
                description = VALUES(description),
                unit_price = VALUES(unit_price)
        `;
        return this.executeQuery(insertQuery,
            [o.orderId, o.skuId, o.amount, o.description, o.unitPrice]
        ).andThen(([r, f]) => {
            const header  = r as ResultSetHeader;
            o.id = header.insertId && o.id
            const createdOrderItem: OrderItem = {
                orderId: o.orderId,
                skuId: o.skuId,
                amount: o.amount,
                description: o.description,
                unitPrice: o.unitPrice,
                createdAt: new Date(),
            }
            return okAsync(createdOrderItem);
        });
    }

    update(orderId: number, skuId: number, o: OrderItemUpdate): ResultAsync<OrderItem, Err> {
        const [clause, values] = SqlHelper.buildUpdateClause(o);
        const query = `UPDATE order_item SET ${clause} WHERE order_id = ? AND sku_id = ?`;
        return this.executeQuery(query,
            [values, orderId, skuId]
        ).andThen(
            ([r, f]) => {
                const header = r as ResultSetHeader;

``
                // Check if any rows were affected
                if (header.affectedRows === 0) {
                    return errAsync(createDatabaseError("Order item not found or no changes made"));
                }

                // Retrieve the updated record
                const selectQuery = `SELECT * FROM \`order_item\` WHERE order_id = ? AND sku_id = ?`;
                return this.executeQuery(selectQuery, [orderId, skuId]).andThen(([r]) => {
                    const fetchedRows = r as OrderItem[];

                    if (fetchedRows.length === 0) {
                        return errAsync(createDatabaseError("Order item not found after update"));
                    }

                    return okAsync(fetchedRows[0]);
                });
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