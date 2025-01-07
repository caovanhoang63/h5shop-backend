import {Err} from "../../../../libs/errors";
import {ResultAsync} from "neverthrow";
import {OrderCreate} from "../entity/orderCreate";
import {IRequester} from "../../../../libs/IRequester";
import {OrderUpdate} from "../entity/orderUpdate";
import {OrderDetail} from "../entity/orderDetail";
import {ICondition} from "../../../../libs/condition";
import {Order, PayOrder} from "../entity/order";
import {Paging} from "../../../../libs/paging";
import {OrderFilter} from "../entity/orderFilter";

export interface IOrderService {
    create(requester: IRequester, o: OrderCreate): ResultAsync<Order, Err>;
    update(requester: IRequester, id: number, o: OrderUpdate): ResultAsync<Order, Err>;
    delete(requester: IRequester, id: number): ResultAsync<void, Err>;
    findById(id: number): ResultAsync<OrderDetail | null, Err>;
    list(cond: OrderFilter, page: Paging): ResultAsync<OrderDetail[], Err>;
    payOrder(requester : IRequester, id: number,payOrder :PayOrder): ResultAsync<OrderDetail, Err>;
    removeCustomer(requester: IRequester, id: number): ResultAsync<void, Err>;
}