import {IOrderService} from "./IOrderService";
import {IOrderRepository} from "../repository/IOrderRepository";
import {inject, injectable} from "inversify";
import {OrderCreate, orderCreateSchema} from "../entity/orderCreate";
import {err, ok, ResultAsync} from "neverthrow";
import {Validator} from "../../../../libs/validator";
import {createInternalError, Err} from "../../../../libs/errors";
import {IRequester} from "../../../../libs/IRequester";
import {TYPES} from "../../../../types";

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
                // Check if seller exists

                const r = await this.orderRepository.create(o);
                if (r.isErr()) {
                    return err(r.error);
                }

                return ok(undefined);
            })(), e => createInternalError(e)
        ).andThen(r => r)
    }

    update = (requester: IRequester, id: number, o: OrderCreate): ResultAsync<void, Err> => {
        return ResultAsync.fromPromise(
            (async () => {
                const vR = (await Validator(orderCreateSchema, o))
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
}