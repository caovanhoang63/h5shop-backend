import {IBaseRepo} from "../../../../libs/IBaseRepo";
import {OrderCreate} from "../entity/orderCreate";
import {ResultAsync} from "neverthrow";
import {Err} from "../../../../libs/errors";
import {OrderUpdate} from "../entity/orderUpdate";
import {OrderDetail} from "../entity/orderDetail";
import {ICondition} from "../../../../libs/condition";
import {Order} from "../entity/order";

export interface IOrderRepository extends IBaseRepo {
    create: (o: OrderCreate) => ResultAsync<Order, Err>;
    update: (id: number, o: OrderUpdate) => ResultAsync<Order, Err>
    delete: (id: number) => ResultAsync<void, Err>;
    findById: (id: number) => ResultAsync<OrderDetail | null, Err>;
    list: (cond: ICondition) => ResultAsync<OrderDetail[], Err>;
    payOrder(order: OrderDetail):ResultAsync<void, Err>;
    removeCustomer(id: number): ResultAsync<void, Err>;
}