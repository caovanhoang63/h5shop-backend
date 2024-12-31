import {IBaseRepo} from "../../../../libs/IBaseRepo";
import {OrderCreate} from "../entity/orderCreate";
import {ResultAsync} from "neverthrow";
import {Err} from "../../../../libs/errors";
import {OrderUpdate} from "../entity/orderUpdate";
import {OrderDetail} from "../entity/orderDetail";
import {ICondition} from "../../../../libs/condition";
import {Order} from "../entity/order";

export interface IOrderRepository extends IBaseRepo {
    create: (o: OrderCreate) => ResultAsync<void, Err>;
    update: (id: number, o: OrderUpdate) => ResultAsync<void, Err>
    delete: (id: number) => ResultAsync<void, Err>;
    findById: (id: number) => ResultAsync<Order | null, Err>;
    list: (cond: ICondition) => ResultAsync<OrderDetail[], Err>;
}