import {Err} from "../../../../libs/errors";
import {ResultAsync} from "neverthrow";
import {OrderCreate} from "../entity/orderCreate";
import {IRequester} from "../../../../libs/IRequester";
import {OrderUpdate} from "../entity/orderUpdate";
import {OrderDetail} from "../entity/orderDetail";
import {ICondition} from "../../../../libs/condition";

export interface IOrderService {
    create(requester: IRequester, o: OrderCreate): ResultAsync<void, Err>;
    update(requester: IRequester, id: number, o: OrderUpdate): ResultAsync<void, Err>;
    delete(requester: IRequester, id: number): ResultAsync<void, Err>;
    list(cond: ICondition): ResultAsync<OrderDetail[], Err>;
}