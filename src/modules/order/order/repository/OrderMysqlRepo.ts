import {IOrderRepository} from "./IOrderRepository";
import {BaseMysqlRepo} from "../../../../components/mysql/BaseMysqlRepo";
import {errAsync, okAsync, ResultAsync} from "neverthrow";
import {OrderCreate} from "../entity/orderCreate";
import {Err} from "../../../../libs/errors";
import {ResultSetHeader, RowDataPacket} from "mysql2";
import {OrderUpdate} from "../entity/orderUpdate";
import {SqlHelper} from "../../../../libs/sqlHelper";
import {OrderDetail} from "../entity/orderDetail";
import {ICondition} from "../../../../libs/condition";

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
        return this.executeQuery(`SELECT status FROM \`order\` WHERE id = ?`, [id]).andThen(
            ([rows, _]) => {
                const result = rows as RowDataPacket[];

                const currentStatus = result[0].status;

                if (currentStatus === 1) {
                    // Hard delete: Remove the order and its items
                    const deleteOrderItemsQuery = `DELETE FROM \`order_item\` WHERE order_id = ?`;
                    const deleteOrderQuery = `DELETE FROM \`order\` WHERE id = ?`;

                    return this.executeQuery(deleteOrderItemsQuery, [id]).andThen(() =>
                        this.executeQuery(deleteOrderQuery, [id])
                    ).andThen(() => okAsync(undefined));
                } else {
                    // Soft delete: Update the status to 0
                    const softDeleteQuery = `UPDATE \`order\` SET status = 0 WHERE id = ?`;
                    return this.executeQuery(softDeleteQuery, [id]).andThen(() => okAsync(undefined));
                }
            }
        )
    }

    list(cond: ICondition): ResultAsync<OrderDetail[], Err> {
        const [whereClause, values] = SqlHelper.buildWhereClause(cond);
        const query = `
            SELECT
                o.id,
                o.customer_id,
                o.seller_id,
                o.status,
                o.order_type,
                o.description,
                o.created_at AS order_created_at,
                o.updated_at AS order_updated_at,
                oi.sku_id,
                oi.amount,
                oi.description AS item_description,
                oi.unit_price,
                oi.discount,
                oi.created_at AS item_created_at
            FROM \`order\` AS o
                     LEFT JOIN order_item AS oi ON o.id = oi.order_id
                ${whereClause}
            ORDER BY o.id ASC, oi.sku_id ASC;
        `;
        return this.executeQuery(query, values).andThen(
            ([r, f]) => {
                const rows = r as RowDataPacket[];
                const ordersMap = new Map<number, OrderDetail>();

                rows.forEach((row) => {
                    const camelRow = SqlHelper.toCamelCase(row);

                    // Check if the order already exists in the map
                    if (!ordersMap.has(camelRow.id)) {
                        ordersMap.set(camelRow.id, {
                            id: camelRow.id,
                            customerId: camelRow.customerId,
                            sellerId: camelRow.sellerId,
                            status: camelRow.status,
                            orderType: camelRow.orderType,
                            description: camelRow.description,
                            createAt: camelRow.createdAt,
                            updateAt: camelRow.updatedAt,
                            items: [], // Initialize the items array
                        });
                    }

                    // Add the order item to the corresponding order
                    if (camelRow.skuId) {
                        const order = ordersMap.get(camelRow.id);
                        order?.items.push({
                            orderId: camelRow.id,
                            skuId: camelRow.skuId,
                            amount: camelRow.amount,
                            unitPrice: camelRow.unitPrice,
                            discount: camelRow.discount,
                            description: camelRow.itemDescription,
                            createAt: camelRow.itemCreatedAt,
                        });
                    }
                });

                // Convert the map to an array of unique orders
                const uniqueOrders = Array.from(ordersMap.values());

                return okAsync(uniqueOrders);
            })
            .orElse((error) => errAsync(error));
    }
}