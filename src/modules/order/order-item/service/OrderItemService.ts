import {IOrderItemService} from "./IOrderItemService";
import {inject, injectable} from "inversify";
import {IOrderItemRepository} from "../repository/IOrderItemRepository";
import {TYPES} from "../../../../types";
import {createInternalError, Err} from "../../../../libs/errors";
import {err, ok, ResultAsync} from "neverthrow";
import {OrderItemCreate, orderItemCreateSchema} from "../entity/orderItemCreate";
import {Validator} from "../../../../libs/validator";
import {IRequester} from "../../../../libs/IRequester";
import {OrderItemUpdate, orderItemUpdateSchema} from "../entity/orderItemUpdate";

@injectable()
export class OrderItemService implements IOrderItemService {
    constructor(@inject(TYPES.IOrderItemRepository) private readonly orderItemRepository: IOrderItemRepository) {
    }

    create = (requester: IRequester, o: OrderItemCreate): ResultAsync<void, Err> => {
        return ResultAsync.fromPromise(
            (async () => {
                const vR = (await Validator(orderItemCreateSchema, o))
                if (vR.isErr()) {
                    return err(vR.error);
                }

                // Check if order exists
                // Check if sku exists

                const r = await this.orderItemRepository.create(o);
                if (r.isErr()) {
                    return err(r.error);
                }

                return ok(undefined);
            })(), e => createInternalError(e)
        ).andThen(r => r)
    }

    update = (requester: IRequester, orderId: number, skuId: number, o: OrderItemUpdate): ResultAsync<void, Err> => {
        return ResultAsync.fromPromise(
            (async () => {
                const vR = (await Validator(orderItemUpdateSchema, o))
                if (vR.isErr()) {
                    return err(vR.error);
                }

                const r = await this.orderItemRepository.update(orderId, skuId, o);
                if (r.isErr()) {
                    return err(r.error);
                }

                return ok(undefined);
            })(), e => createInternalError(e)
        ).andThen(r => r);
    }

    delete(requester: IRequester, orderId: number, skuId: number): ResultAsync<void, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                const r = await this.orderItemRepository.delete(orderId, skuId);
                if (r.isErr()) {
                    return err(r.error);
                }

                return ok(undefined);
            })(), e => createInternalError(e)
        ).andThen(r => r)
    }
}