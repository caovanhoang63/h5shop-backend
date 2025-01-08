import {IOrderRepository} from "./IOrderRepository";
import {BaseMysqlRepo} from "../../../../components/mysql/BaseMysqlRepo";
import {err, errAsync, ok, okAsync, ResultAsync} from "neverthrow";
import {OrderCreate} from "../entity/orderCreate";
import {createDatabaseError, createEntityNotFoundError, Err} from "../../../../libs/errors";
import {ResultSetHeader, RowDataPacket} from "mysql2";
import {OrderUpdate} from "../entity/orderUpdate";
import {SqlHelper} from "../../../../libs/sqlHelper";
import {OrderDetail, OrderItemDetail} from "../entity/orderDetail";
import {ICondition} from "../../../../libs/condition";
import {Order} from "../entity/order";
import {Paging} from "../../../../libs/paging";
import {OrderFilter} from "../entity/orderFilter";

export class OrderMysqlRepo extends BaseMysqlRepo implements IOrderRepository {

    create(o: OrderCreate): ResultAsync<Order, Err> {
        const query = `INSERT INTO \`order\` (customer_id, seller_id, order_type, description) VALUES (?, ?, ?, ?)`;
        return this.executeQuery(query,
            [o.customerId, o.sellerId, o.orderType, o.description]
        ).andThen(
            ([r, f]) => {
                const header = r as ResultSetHeader;
                o.id = header.insertId;
                const createdOrder: Order = {
                    id: header.insertId,
                    customerId: o.customerId,
                    status: 1,
                    sellerId: o.sellerId,
                    orderType: o.orderType,
                    description: o.description,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    finalAmount: 0,
                    totalAmount: 0,
                    discountAmount: 0,
                    pointUsed : 0,
                };
                return okAsync(createdOrder);
            });
    }

    update(id: number, o: OrderUpdate): ResultAsync<Order, Err> {
        const [clause, values] = SqlHelper.buildUpdateClause(o);
        const query = `UPDATE \`order\` SET ${clause} WHERE id = ?`;
        return this.executeQuery(query, [...values, id]).andThen(
            ([r, f]) => {
                const header = r as ResultSetHeader;


                // Check if any rows were affected
                if (header.affectedRows === 0) {
                    return errAsync(createDatabaseError("Order not found or no changes made"));
                }

                // Retrieve the updated record
                const selectQuery = `SELECT * FROM \`order\` WHERE id = ?`;
                return this.executeQuery(selectQuery, [id]).andThen(([r]) => {
                    const fetchedRows = r as Order[];

                    if (fetchedRows.length === 0) {
                        return errAsync(createDatabaseError("Order not found after update"));
                    }

                    return okAsync(fetchedRows[0]);
                });
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

    findById(id: number): ResultAsync<OrderDetail | null, Err> {
        const query = `SELECT * FROM \`order\` WHERE id = ?`;
        const itemQuery = `SELECT * FROM order_item WHERE order_id = ?`;
        let order : OrderDetail | null = null;
        return this.executeQuery(query, [id]).andThen(
            ([r, f]) => {
                const firstRow = (r as RowDataPacket[])[0];
                if(!firstRow) {
                    return err(createEntityNotFoundError("Order not found"));
                }
                order = SqlHelper.toCamelCase(firstRow) as OrderDetail
                return ok(order)
            }
        ).andThen(
            r => this.executeQuery(
                itemQuery,
                [r.id]
            )
        ).andThen(
            ([r, f]) => {
                const rows = r as RowDataPacket[];
                order!.items = rows.map(row => SqlHelper.toCamelCase(row) as OrderItemDetail)
                return ok(order)
            }
        )
    }

    list(cond: OrderFilter, page: Paging): ResultAsync<OrderDetail[], Err> {
        const [whereClause, values] = SqlHelper.buildWhereClause(cond,"o");
        const pagingClause = SqlHelper.buildPaginationClause(page);
        const query = `
            WITH PaginatedOrders AS (
                SELECT
                    o.id,
                    o.customer_id,
                    o.point_used,
                    o.seller_id,
                    o.status,
                    o.order_type,
                    o.description,
                    o.total_amount,
                    o.discount_amount,
                    o.final_amount,
                    o.created_at AS order_created_at,
                    o.updated_at AS order_updated_at
                FROM \`order\` AS o
                ${whereClause}
            ORDER BY o.id DESC 
                ${pagingClause}
                )
            SELECT
                po.*,
                oi.sku_id,
                oi.amount,
                oi.unit_price,
                oi.description AS item_description,
                oi.created_at AS item_created_at
            FROM PaginatedOrders AS po
                     LEFT JOIN order_item AS oi ON po.id = oi.order_id
            ORDER BY po.id DESC, oi.sku_id ASC;
        `;
        const countQuery = `SELECT COUNT(id) as total FROM \`order\` as o ${whereClause}`;
        return this.executeQuery(countQuery, values).andThen(
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
                    return this.executeQuery(query, values).andThen(
                        ([r, f]) => {
                            console.log(query);
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
                                        createdAt: camelRow.orderCreatedAt,
                                        updatedAt: camelRow.orderUpdatedAt,
                                        totalAmount: camelRow.totalAmount,
                                        discountAmount: camelRow.discountAmount,
                                        finalAmount: camelRow.finalAmount,
                                        pointUsed: camelRow.pointUsed,
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
                                        description: camelRow.itemDescription,
                                        createdAt: camelRow.itemCreatedAt,
                                    });
                                }
                            });

                            // Convert the map to an array of unique orders
                            const uniqueOrders = Array.from(ordersMap.values());

                            return okAsync(uniqueOrders);
                        }
                    )
                }
            });
    }
    payOrder(order: OrderDetail): ResultAsync<void, Err> {
        const orderQuery = `UPDATE \`order\` SET
                     status = 2,
                     total_amount = ?,
                     discount_amount = ?,
                     final_amount = ? ,
                     order_type = ?,
                     point_used = ?
                 WHERE id = ?`;


        const skuQuery = `UPDATE sku SET stock = CASE
                            ${order.items.map(r => ` WHEN id = ? THEN stock - ? `).join(' ')}
                            END
                          WHERE id IN (?)`;

        const customerQuery = `UPDATE customer SET discount_point = discount_point - ? WHERE id = ? `


        const skuValue = order.items.map(r =>[r.skuId,r.amount]).flat();
        const ids = order.items.map(r => r.skuId)
        return this.executeInTransaction(
            conn => {
                return ResultAsync.fromPromise(
                    conn.query(orderQuery,[order.totalAmount,order.discountAmount,order.finalAmount,order.orderType,order.pointUsed,order.id]),
                    e => createDatabaseError(e)
                ).andThen(
                    r=>{
                        return ResultAsync.fromPromise(
                            conn.query(skuQuery,[...skuValue,...ids]),
                            e => createDatabaseError(e)
                        )
                    }
                ).andThen(
                    r=> ResultAsync.fromPromise(
                        conn.query(customerQuery,[order.pointUsed,order.customerId]),
                        e => createDatabaseError(e)
                    )
                ).andThen(r => ok(undefined))
            }
        )
    }

    removeCustomer(id: number): ResultAsync<void, Err> {
        const query = `UPDATE \`order\` SET customer_id = NULL WHERE id = ?`;
        return this.executeQuery(query, [id]).andThen(
            ([r, f]) => {
                return ok(undefined);
            }
        );
    }
}