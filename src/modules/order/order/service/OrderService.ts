import {IOrderService} from "./IOrderService";
import {IOrderRepository} from "../repository/IOrderRepository";
import {inject, injectable} from "inversify";
import {OrderCreate, orderCreateSchema} from "../entity/orderCreate";
import {err, ok, ResultAsync} from "neverthrow";
import {Validator} from "../../../../libs/validator";
import {createInternalError, Err} from "../../../../libs/errors";
import {IRequester} from "../../../../libs/IRequester";
import {TYPES} from "../../../../types";
import {OrderUpdate, orderUpdateSchema} from "../entity/orderUpdate";
import {OrderDetail} from "../entity/orderDetail";
import {ICondition} from "../../../../libs/condition";
import {Order} from "../entity/order";

@injectable()
export class OrderService implements IOrderService {
    constructor(@inject(TYPES.IOrderRepository) private readonly orderRepository: IOrderRepository) {
    }

    create = (requester: IRequester, o: OrderCreate): ResultAsync<void, Err> => {
        return ResultAsync.fromPromise(
            (async () => {
                const vR = (await Validator(orderCreateSchema, o))
                if (vR.isErr()) {
                    return err(vR.error);
                }

                // Check if customer exists


                const r = await this.orderRepository.create(o);
                if (r.isErr()) {
                    return err(r.error);
                }

                return ok(undefined);
            })(), e => createInternalError(e)
        ).andThen(r => r)
    }

    update = (requester: IRequester, id: number, o: OrderUpdate): ResultAsync<void, Err> => {
        return ResultAsync.fromPromise(
            (async () => {
                const vR = (await Validator(orderUpdateSchema, o))
                if (vR.isErr()) {
                    return err(vR.error);
                }

                // Check if customer exists
                // Check if seller exists

                const r = await this.orderRepository.update(id, o);
                if (r.isErr()) {
                    return err(r.error);
                }

                return ok(undefined);
            })(), e => createInternalError(e)
        ).andThen(r => r)
    }

    delete(requester: IRequester, id: number): ResultAsync<void, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                const r = await this.orderRepository.delete(id);
                if (r.isErr()) {
                    return err(r.error);
                }

                return ok(undefined);
            })(), e => createInternalError(e)
        ).andThen(r => r)
    }

    findById = (id: number): ResultAsync<Order | null, Err> => {
        return ResultAsync.fromPromise(
            (async () => {
                const r = await this.orderRepository.findById(id);
                if (r.isErr()) {
                    return err(r.error);
                }

                return ok(r.value);
            })(), e => createInternalError(e)
        ).andThen(r => r)
    }

    list = (cond: ICondition): ResultAsync<OrderDetail[], Err> => {
        return ResultAsync.fromPromise(
            (async () => {
                const r = await this.orderRepository.list(cond);
                if (r.isErr()) {
                    return err(r.error);
                }

                return ok(r.value);
            })(), e => createInternalError(e)
        ).andThen(r => r)
    }
}