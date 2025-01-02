import {Err} from "../../../../libs/errors";
import {ResultAsync} from "neverthrow";
import {OrderCreate} from "../entity/orderCreate";
import {IRequester} from "../../../../libs/IRequester";
import {OrderUpdate} from "../entity/orderUpdate";
import {OrderDetail} from "../entity/orderDetail";
import {ICondition} from "../../../../libs/condition";
import {Order, PayOrder} from "../entity/order";

export interface IOrderService {
    create(requester: IRequester, o: OrderCreate): ResultAsync<Order, Err>;
    update(requester: IRequester, id: number, o: OrderUpdate): ResultAsync<Order, Err>;
    delete(requester: IRequester, id: number): ResultAsync<void, Err>;
    findById(id: number): ResultAsync<Order | null, Err>;
    list(cond: ICondition): ResultAsync<OrderDetail[], Err>;
    payOrder(requester : IRequester, id: number,payOrder :PayOrder): ResultAsync<void, Err>;
}