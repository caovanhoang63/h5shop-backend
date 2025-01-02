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
import {Order, OrderType, PayOrder} from "../entity/order";
import {ISkuRepository} from "../../../catalog/sku/repository/ISkuRepository";
import {createMessage, IPubSub} from "../../../../components/pubsub";
import {topicPayOrder} from "../../../../libs/topics";
import {ICustomerRepository} from "../../../customer/repo/ICustomerRepository";
import {ISettingRepo} from "../../../setting/repo/ISettingRepo";
import {MONEY_TO_POINT_KEY, POINT_TO_DISCOUNT_KEY} from "../../../../libs/settingKey";
import { Customer } from "../../../customer/entity/customer";
import { ISkuService } from "../../../catalog/sku/service/ISkuService";
import {FilterSkuGetWholeSale} from "../../../catalog/sku/entity/skuGetWholeSale";

@injectable()
export class OrderService implements IOrderService {
    constructor(@inject(TYPES.IOrderRepository) private readonly orderRepository: IOrderRepository,
                @inject(TYPES.ISkuService) private readonly skuService: ISkuService,
                // @inject(TYPES.ISkuRepository) private readonly skuRepository: ISkuRepository,
                @inject(TYPES.IPubSub) private readonly pubSub : IPubSub,
                @inject(TYPES.ICustomerRepository) private  readonly customerRepository : ICustomerRepository,
                @inject(TYPES.ISettingRepository) private readonly settingRepository: ISettingRepo) {
    }


    create = (requester: IRequester, o: OrderCreate): ResultAsync<Order, Err> => {
        return ResultAsync.fromPromise(
            (async () => {
                const vR = (await Validator(orderCreateSchema, o))
                if (vR.isErr()) {
                    return err(vR.error);
                }

                // Check if customer exists
                if (o.customerId) {
                    const customerR = await this.customerRepository.findById(o.customerId);
                    if (customerR.isErr()) {return errAsync(createInternalError(customerR.error))}

                    if (!customerR.value) {return errAsync(createInvalidDataError(new Error("Invalid customer")))}
                }


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


    payOrder(requester: IRequester, id: number,payOrder :PayOrder): ResultAsync<void, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                const orderR =await this.orderRepository.findById(id)

                if (orderR.isErr()) {
                    return errAsync(orderR.error)
                }

                const order = orderR.value!

                // VALIDATE ORDER
                if (order.status != 1) {
                    return err(createInvalidRequestError(new Error("order not found or already pay")))
                }

                if (order.items.length <= 0) {
                    return errAsync(createInvalidDataError(new Error("empty order")))
                }

                // HANDLE USE DISCOUNT POINT
                let customer : Customer | null = null
                if (order.customerId) {
                    const customerR = await this.customerRepository.findById(order.customerId);
                    if (customerR.isErr()) {return errAsync(createInternalError(customerR.error))}

                    if (!customerR.value) {return errAsync(createInvalidDataError(new Error("Invalid customer")))}
                    customer = customerR.value
                }

                const SkuR = await this.skuService.getListWholeSale(
                    order.items.map(r=>{
                            return {
                                id: r.skuId,
                                quantity: r.amount,
                            } as  FilterSkuGetWholeSale
                        }
                    )
                )

                if (SkuR.isErr()) {
                    return errAsync(SkuR.error)
                }

                const skus = SkuR.value || [] ;
                if (skus.length != order.items.length){
                    return errAsync(createInvalidDataError(new Error("Invalid skus")))
                }



                let isWhole = false;
                for (let i = 0 ; i< skus.length; i++) {
                    if (skus[i].stock < order.items[i].amount) {
                        return errAsync(createInvalidRequestError(new Error(`${skus[i].id}`)))
                    }
                    console.log(skus[i].stock,skus[i].price)
                    isWhole = skus[i].isWholeSale;
                    order.totalAmount = skus[i].price * order.items[i].amount;
                }

                // if is a whole bill => don't use discount point
                if (isWhole) {
                    order.orderType = OrderType.Wholesale
                    payOrder.isUsePoint = false
                }

                // CALCULATE DISCOUNT
                if (payOrder.isUsePoint && customer) {
                    const ratioR = await this.settingRepository.findByName(POINT_TO_DISCOUNT_KEY)
                    if (ratioR.isErr()) {
                        return err(createInternalError(ratioR.error))
                    }
                    if (!ratioR.value) {
                        return err(createInternalError(`${POINT_TO_DISCOUNT_KEY} is not a valid value`));
                    }
                    const ratio = parseFloat(ratioR.value.value)
                    order.discountAmount = ratio * customer.discountPoint
                    if (order.discountAmount > order.totalAmount) {
                        order.pointUsed =  Math.floor(order.discountAmount - order.discountAmount) / ratio
                        order.discountAmount = order.totalAmount
                    } else {
                        order.pointUsed = customer.discountPoint
                    }
                }

                // CALCULATE FINAL AMOUNT
                order.finalAmount = order.totalAmount - order.discountAmount;
                if (order.finalAmount <= 0 ) {
                    order.finalAmount = 0
                }

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