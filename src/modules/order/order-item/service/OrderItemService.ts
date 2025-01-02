import {IOrderItemService} from "./IOrderItemService";
import {inject, injectable} from "inversify";
import {IOrderItemRepository} from "../repository/IOrderItemRepository";
import {TYPES} from "../../../../types";
import {createEntityNotFoundError, createInternalError, createInvalidDataError, Err} from "../../../../libs/errors";
import {err, ok, ResultAsync} from "neverthrow";
import {OrderItemCreate, orderItemCreateSchema} from "../entity/orderItemCreate";
import {Validator} from "../../../../libs/validator";
import {IRequester} from "../../../../libs/IRequester";
import {OrderItemUpdate, orderItemUpdateSchema} from "../entity/orderItemUpdate";
import {IOrderRepository} from "../../order/repository/IOrderRepository";
import {ISkuRepository} from "../../../catalog/sku/repository/ISkuRepository";
import {OrderItem} from "../entity/orderItem";
import { ISkuService } from "../../../catalog/sku/service/ISkuService";

@injectable()
export class OrderItemService implements IOrderItemService {
    constructor(
        @inject(TYPES.IOrderItemRepository) private readonly orderItemRepository: IOrderItemRepository,
        @inject(TYPES.IOrderRepository) private readonly orderRepository: IOrderRepository,
        @inject(TYPES.ISkuRepository) private readonly skuRepository: ISkuRepository,
        @inject(TYPES.ISkuService) private readonly skuService: ISkuService,
    ) {
    }

    create = (requester: IRequester, o: OrderItemCreate): ResultAsync<OrderItem, Err> => {
        return ResultAsync.fromPromise(
            (async () => {
                const vR = (await Validator(orderItemCreateSchema, o))
                if (vR.isErr()) {
                    return err(vR.error);
                }

                // Check if the order exists
                const orderCheck = await this.orderRepository.findById(o.orderId);
                if (orderCheck.isErr()) return err(orderCheck.error);
                if (orderCheck.value === null) return err(createEntityNotFoundError("Order"));

                // Check if the sku exists
                // const skuCheck = await this.skuRepository.findById(o.skuId);


                const skuCheck = await this.skuService.getListWholeSale([{
                    quantity : o.amount,
                    id: o.skuId,
                }])
                if (skuCheck.isErr()) return err(skuCheck.error);
                if (skuCheck.value === null || skuCheck.value.length == 0) return err(createEntityNotFoundError("Sku"));

                if (skuCheck.value[0].stock < o.amount)
                    return err(createInvalidDataError(new Error("Stock not enough")));

                o.unitPrice = skuCheck.value[0].price

                const r = await this.orderItemRepository.create(o);
                if (r.isErr()) {
                    return err(r.error);
                }

                return ok(r.value);
            })(), e => createInternalError(e)
        ).andThen(r => r)
    }

    update = (requester: IRequester, orderId: number, skuId: number, o: OrderItemUpdate): ResultAsync<OrderItem, Err> => {
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

                return ok(r.value);
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