import {IBaseRepo} from "../../../../libs/IBaseRepo";
import {ResultAsync} from "neverthrow";
import {Err} from "../../../../libs/errors";
import {OrderItemCreate} from "../entity/orderItemCreate";
import {OrderItemUpdate} from "../entity/orderItemUpdate";

export interface IOrderItemRepository extends IBaseRepo {
    create: (o: OrderItemCreate) => ResultAsync<void, Err>;
    update: (orderId: number, skuId: number, o: OrderItemUpdate) => ResultAsync<void, Err>
    delete: (orderId: number, skuId: number) => ResultAsync<void, Err>;
}