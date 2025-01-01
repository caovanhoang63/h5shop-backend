import {IOrderService} from "./IOrderService";
import {IOrderRepository} from "../repository/IOrderRepository";
import {inject, injectable} from "inversify";
import {OrderCreate, orderCreateSchema} from "../entity/orderCreate";
import {err, errAsync, ok, ResultAsync} from "neverthrow";
import {Validator} from "../../../../libs/validator";
import {createInternalError, createInvalidDataError, createInvalidRequestError, Err} from "../../../../libs/errors";
import {IRequester} from "../../../../libs/IRequester";
import {TYPES} from "../../../../types";
import {OrderUpdate, orderUpdateSchema} from "../entity/orderUpdate";
import {OrderDetail} from "../entity/orderDetail";
import {ICondition} from "../../../../libs/condition";
import {Order} from "../entity/order";
import {ISkuRepository} from "../../../catalog/sku/repository/ISkuRepository";
import {createMessage, IPubSub} from "../../../../components/pubsub";
import {topicPayOrder} from "../../../../libs/topics";

@injectable()
export class OrderService implements IOrderService {
    constructor(@inject(TYPES.IOrderRepository) private readonly orderRepository: IOrderRepository,
                @inject(TYPES.ISkuRepository) private readonly skuRepository: ISkuRepository,
                @inject(TYPES.IPubSub) private readonly pubSub : IPubSub,) {
    }


    create = (requester: IRequester, o: OrderCreate): ResultAsync<Order, Err> => {
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

                return ok(r.value);
            })(), e => createInternalError(e)
        ).andThen(r => r)
    }

    update = (requester: IRequester, id: number, o: OrderUpdate): ResultAsync<Order, Err> => {
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

                return ok(r.value);
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


    payOrder(requester: IRequester, id: number): ResultAsync<void, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                const orderR =await this.orderRepository.findById(id)

                if (orderR.isErr()) {
                    return errAsync(orderR.error)
                }
                const order = orderR.value!

                if (order.status != 1) {
                    return err(createInvalidRequestError(new Error("order not found or already pay")))
                }
                if (order.items.length <= 0) {
                    return errAsync(createInvalidDataError(new Error("empty order")))
                }
                const SkuR = await this.skuRepository.findByIds(order.items.map(r=>r.skuId))
                if (SkuR.isErr()) {
                    return errAsync(SkuR.error)
                }



                const skus = SkuR.value;
                if (skus.length != order.items.length){
                    return errAsync(createInvalidDataError(new Error("Invalid skus")))
                }

                for (let i = 0 ; i< skus.length; i++) {
                    if (skus[i].stock < order.items[i].amount) {
                        return errAsync(createInvalidRequestError(new Error(`${skus[i].id}`)))
                    }
                    order.totalAmount = skus[i].price * order.items[i].amount;
                }

                order.finalAmount = order.totalAmount -order.discountAmount;

                const r = await this.orderRepository.payOrder(order)
                if (r.isErr()) {
                    return err(r.error)
                }
                this.pubSub.Publish(topicPayOrder, createMessage(order,requester))

                return ok(undefined)

        })(), e => createInternalError(e)).andThen(r=>r)
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