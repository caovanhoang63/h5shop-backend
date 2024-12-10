import {IBaseRepo} from "../../../../libs/IBaseRepo";
import {OrderCreate} from "../entity/orderCreate";
import {ResultAsync} from "neverthrow";
import {Err} from "../../../../libs/errors";
import {OrderUpdate} from "../entity/orderUpdate";
import {Order} from "../entity/order";

export interface IOrderRepository extends IBaseRepo {
    create: (o: OrderCreate) => ResultAsync<void, Err>;
    update: (id: number, o: OrderUpdate) => ResultAsync<void, Err>
    delete: (id: number) => ResultAsync<void, Err>;
}