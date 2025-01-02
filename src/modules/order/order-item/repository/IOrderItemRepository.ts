import {IBaseRepo} from "../../../../libs/IBaseRepo";
import {ResultAsync} from "neverthrow";
import {Err} from "../../../../libs/errors";
import {OrderItemCreate} from "../entity/orderItemCreate";
import {OrderItemUpdate} from "../entity/orderItemUpdate";
import {OrderItem} from "../entity/orderItem";

export interface IOrderItemRepository extends IBaseRepo {
    create: (o: OrderItemCreate) => ResultAsync<OrderItem, Err>;
    update: (orderId: number, skuId: number, o: OrderItemUpdate) => ResultAsync<OrderItem, Err>
    delete: (orderId: number, skuId: number) => ResultAsync<void, Err>;
}