import {Err} from "../../../../libs/errors";
import {ResultAsync} from "neverthrow";
import {OrderItemCreate} from "../entity/orderItemCreate";
import {IRequester} from "../../../../libs/IRequester";
import {OrderItemUpdate} from "../entity/orderItemUpdate";
import {OrderItem} from "../entity/orderItem";

export interface IOrderItemService {
    create(requester: IRequester, o: OrderItemCreate): ResultAsync<OrderItem, Err>;
    update(requester: IRequester, orderId: number, skuId: number, o: OrderItemUpdate): ResultAsync<OrderItem, Err>;
    delete(requester: IRequester, orderId: number, skuId: number): ResultAsync<void, Err>;
}