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
import {Paging} from "../../../../libs/paging";
import {OrderFilter} from "../entity/orderFilter";
import {IUserRepository} from "../../../user/repository/IUserRepository";

@injectable()
export class OrderService implements IOrderService {
    constructor(@inject(TYPES.IOrderRepository) private readonly orderRepository: IOrderRepository,
                @inject(TYPES.ISkuService) private readonly skuService: ISkuService,
                @inject(TYPES.ISkuRepository) private readonly skuRepository: ISkuRepository,
                @inject(TYPES.IPubSub) private readonly pubSub : IPubSub,
                @inject(TYPES.ICustomerRepository) private  readonly customerRepository : ICustomerRepository,
                @inject(TYPES.ISettingRepository) private readonly settingRepository: ISettingRepo,
                @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
    ) {
    }


    create = (requester: IRequester, o: OrderCreate): ResultAsync<Order, Err> => {
        return ResultAsync.fromPromise(
            (async () => {
                const vR = (await Validator(orderCreateSchema, o))
                if (vR.isErr()) {
                    return err(vR.error);
                }

                if (requester.userId) {
                    o.sellerId = requester.userId
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
                if (o.customerId) {
                    const customerR = await this.customerRepository.findById(o.customerId);
                    if (customerR.isErr()) {return errAsync(createInternalError(customerR.error))}

                    if (!customerR.value) {return errAsync(createInvalidDataError(new Error("Invalid customer")))}
                }

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

    findById = (id: number): ResultAsync<OrderDetail | null, Err> => {
        return ResultAsync.fromPromise(
            (async () => {
                const r = await this.orderRepository.findById(id);
                if (r.isErr()) {
                    return err(r.error);
                }

                const order = r.value!;

                // Map customer if has
                if (order.customerId) {
                    const customerR = await this.customerRepository.findById(order.customerId);

                    if (!customerR.isErr() && customerR.value) {
                        const lastName = customerR.value.lastName ? customerR.value.lastName : "";
                        const firstName = customerR.value.firstName ? customerR.value.firstName : "";
                        order.customerName = lastName + " " + firstName;
                        order.customerPhone = customerR.value?.phoneNumber;
                    }
                }

                // Map seller if has
                if (order.sellerId) {
                    const sellerR = await this.userRepository.findByUserId(order.sellerId);

                    if (!sellerR.isErr() && sellerR.value) {
                        const lastName = sellerR.value.lastName ? sellerR.value.lastName : "";
                        const firstName = sellerR.value.firstName ? sellerR.value.firstName : "";
                        order.sellerName = lastName + " " + firstName;
                    }
                }

                // Map sku detail
                await Promise.all(
                    order.items.map(async (item) => {
                        const skuDetailResult = await this.skuRepository.getDetailById(item.skuId);
                        if (skuDetailResult.isErr()) {
                            throw skuDetailResult.error; // Throw to be caught by ResultAsync
                        }
                        item.skuDetail = skuDetailResult.value ? skuDetailResult.value : undefined;
                        if (item.skuDetail) {
                            const nameSpu = item.skuDetail.spuName;
                            const skuTierIdxByAttribute = item.skuDetail.skuTierIdx?.map((skuTierIdx, index) => {
                                return item.skuDetail?.attributes[index]?.value[skuTierIdx];
                            });
                            item.skuDetail.name = `${nameSpu} ${skuTierIdxByAttribute?.join(' ')??""}`;
                        }
                    })
                );

                return ok(r.value);
            })(), e => createInternalError(e)
        ).andThen(r => r)
    }


    payOrder(requester: IRequester, id: number,payOrder :PayOrder): ResultAsync<OrderDetail, Err> {
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

                // Map customer name and number
                if (customer) {
                    order.customerName = customer.lastName + " " + customer.firstName;
                    order.customerPhone = customer.phoneNumber;
                }

                // Map customer if has
                if (order.customerId) {
                    const customerR = await this.customerRepository.findById(order.customerId);

                    if (!customerR.isErr() && customerR.value) {
                        const lastName = customerR.value.lastName ? customerR.value.lastName : "";
                        const firstName = customerR.value.firstName ? customerR.value.firstName : "";
                        order.customerName = lastName + " " + firstName;
                        order.customerPhone = customerR.value?.phoneNumber;
                    }
                }

                // Map sku detail
                await Promise.all(
                    order.items.map(async (item) => {
                        const skuDetailResult = await this.skuRepository.getDetailById(item.skuId);
                        if (skuDetailResult.isErr()) {
                            throw skuDetailResult.error; // Throw to be caught by ResultAsync
                        }
                        item.skuDetail = skuDetailResult.value ? skuDetailResult.value : undefined;
                        if (item.skuDetail) {
                            const nameSpu = item.skuDetail.spuName;
                            const skuTierIdxByAttribute = item.skuDetail.skuTierIdx?.map((skuTierIdx, index) => {
                                return item.skuDetail?.attributes[index]?.value[skuTierIdx];
                            });
                            item.skuDetail.name = `${nameSpu} ${skuTierIdxByAttribute?.join(' ')??""}`;
                        }
                    })
                );
                this.pubSub.Publish(topicPayOrder, createMessage(order,requester))

                return ok(order)

        })(), e => createInternalError(e)).andThen(r=>r)
    }


    list(cond: OrderFilter, page: Paging): ResultAsync<OrderDetail[], Err> {
        return ResultAsync.fromPromise(
            (async () => {
                const r = await this.orderRepository.list(cond, page);
                if (r.isErr()) {
                    return err(r.error);
                }

                // Map sku detail
                const orders = r.value!;
                await Promise.all(
                    orders.map(async (order) => {
                        // Map customer if has
                        if (order.customerId) {
                            const customerR = await this.customerRepository.findById(order.customerId);

                            if (!customerR.isErr() && customerR.value) {
                                const lastName = customerR.value.lastName ? customerR.value.lastName : "";
                                const firstName = customerR.value.firstName ? customerR.value.firstName : "";
                                order.customerName = lastName + " " + firstName;
                                order.customerPhone = customerR.value?.phoneNumber;
                            }
                        }
                        // Map seller if has
                        if (order.sellerId) {
                            const sellerR = await this.userRepository.findByUserId(order.sellerId);

                            if (!sellerR.isErr() && sellerR.value) {
                                const lastName = sellerR.value.lastName ? sellerR.value.lastName : "";
                                const firstName = sellerR.value.firstName ? sellerR.value.firstName : "";
                                order.sellerName = lastName + " " + firstName;
                            }
                        }
                        await Promise.all(
                            order.items.map(async (item) => {
                                const skuDetailResult = await this.skuRepository.getDetailById(item.skuId);
                                if (skuDetailResult.isErr()) {
                                    throw skuDetailResult.error; // Throw to be caught by ResultAsync
                                }
                                item.skuDetail = skuDetailResult.value ? skuDetailResult.value : undefined;
                                if (item.skuDetail) {
                                    const nameSpu = item.skuDetail.spuName;
                                    const skuTierIdxByAttribute = item.skuDetail.skuTierIdx?.map((skuTierIdx, index) => {
                                        return item.skuDetail?.attributes[index]?.value[skuTierIdx];
                                    });
                                    item.skuDetail.name = `${nameSpu} ${skuTierIdxByAttribute?.join(' ')??""}`;
                                }
                            })
                        );
                    })
                );
                return ok(r.value);
            })(), e => createInternalError(e)
        ).andThen(r => r)
    }

    removeCustomer(requester: IRequester, id: number): ResultAsync<void, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                const r = await this.orderRepository.removeCustomer(id);
                if (r.isErr()) {
                    return err(r.error);
                }

                return ok(undefined);
            })(), e => createInternalError(e)
        ).andThen(r => r)
    }
}