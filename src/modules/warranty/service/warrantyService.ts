import {err, ok, ResultAsync} from "neverthrow";
import { IRequester } from "../../../libs/IRequester";
import { Paging } from "../../../libs/paging";
import { WarrantyFilter } from "../entity/filter";
import { WarrantyForm } from "../entity/warrantyForm";
import {warrantyCreateSchema, WarrantyFormCreate} from "../entity/warrantyFormCreate";
import {IWarrantyService} from "./IWarrantyService";
import {inject, injectable} from "inversify";
import {TYPES} from "../../../types";
import {IWarrantyRepo} from "../repo/IWarrantyRepo";
import {IPubSub} from "../../../components/pubsub";
import {ISkuRepository} from "../../catalog/sku/repository/ISkuRepository";
import {IOrderRepository} from "../../order/order/repository/IOrderRepository";
import {Validator} from "../../../libs/validator";
import {createEntityNotFoundError, createInternalError, createInvalidRequestError} from "../../../libs/errors";


export class WarrantyService implements IWarrantyService {
    constructor(@inject(TYPES.IWarrantyRepository) private readonly warrantyRepo : IWarrantyRepo,
                @inject(TYPES.IPubSub) private readonly pubsub: IPubSub,
                @inject(TYPES.IOrderRepository) private readonly orderRepository: IOrderRepository,
                @inject(TYPES.ISkuRepository) private readonly skuRepository: ISkuRepository,) {
    }

    create(requester: IRequester, create: WarrantyFormCreate): ResultAsync<void, Error> {
        return ResultAsync.fromPromise((async () => {
            const validate = await Validator(warrantyCreateSchema, create);
            if (validate.isErr()) {
                return err(validate.error)
            }
            const order = await this.orderRepository.findById(create.orderId);
            if (order.isErr()) {
                return err(createInternalError(order.error))
            }

            const sku = await this.skuRepository.findById(create.skuId);
            if (sku.isErr()) {
                return err(createInternalError(sku.error))
            }

            const r= await this.warrantyRepo.create(create);
            if (r.isErr()) {
                return err(createInternalError(r));
            }

            return ok(undefined);
        })(), e => createInternalError(e)).andThen(r=>r)
    }
    findById(id: number): ResultAsync<WarrantyForm, Error> {
        return ResultAsync.fromPromise((async () => {
            const r=  await this.warrantyRepo.findById(id)
            if (r.isErr()) {
                return err(createInternalError(r.error))
            }

            if (!r.value) {
                return err(createEntityNotFoundError("warranty"))
            }

            return ok(r.value)
        })(),e => createInternalError(e)).andThen(r=>r)
    }
    findMany(filter: WarrantyFilter, paging: Paging): ResultAsync<WarrantyForm[], Error> {
        return ResultAsync.fromPromise((async () => {
            const r=  await this.warrantyRepo.findMany(filter,paging)
            if (r.isErr()) {
                return err(createInternalError(r.error))
            }

            return ok(r.value)
        })(),e => createInternalError(e)).andThen(r=>r)
    }
}