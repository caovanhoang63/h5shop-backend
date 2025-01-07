import {err, ok, ResultAsync} from "neverthrow";
import { IRequester } from "../../../libs/IRequester";
import { Paging } from "../../../libs/paging";
import {WarrantyFilter, warrantyFilterSchema} from "../entity/filter";
import { WarrantyForm } from "../entity/warrantyForm";
import {warrantyCreateSchema, WarrantyFormCreate} from "../entity/warrantyFormCreate";
import {IWarrantyService} from "./IWarrantyService";
import {inject, injectable} from "inversify";
import {TYPES} from "../../../types";
import {IWarrantyRepo} from "../repo/IWarrantyRepo";
import {createMessage, IPubSub} from "../../../components/pubsub";
import {ISkuRepository} from "../../catalog/sku/repository/ISkuRepository";
import {IOrderRepository} from "../../order/order/repository/IOrderRepository";
import {Validator} from "../../../libs/validator";
import {createEntityNotFoundError, createInternalError, createInvalidRequestError} from "../../../libs/errors";
import {brandUpdateScheme} from "../../catalog/brand/entity/brandUpdate";
import {topicCreateWarrantyForm, topicUpdateBrand, topicUpdateWarrantyForm} from "../../../libs/topics";


export class WarrantyService implements IWarrantyService {
    constructor(@inject(TYPES.IWarrantyRepository) private readonly warrantyRepo : IWarrantyRepo,
                @inject(TYPES.IPubSub) private readonly pubSub: IPubSub,
                @inject(TYPES.IOrderRepository) private readonly orderRepository: IOrderRepository,
                @inject(TYPES.ISkuRepository) private readonly skuRepository: ISkuRepository,) {
    }

    create(requester: IRequester, create: WarrantyFormCreate): ResultAsync<void, Error> {
        return ResultAsync.fromPromise((async () => {
            const validate = await Validator(warrantyCreateSchema, create);
            if (validate.isErr()) {
                return err(validate.error)
            }

            const sku = await this.skuRepository.findById(create.skuId);
            if (sku.isErr()) {
                return err(createInternalError(sku.error))
            }

            const r= await this.warrantyRepo.create(create);
            if (r.isErr()) {
                return err(createInternalError(r));
            }

            this.pubSub.Publish(topicCreateWarrantyForm,createMessage({
                id: r.value,
                old: null,
                new: create
            },requester))

            return ok(undefined);
        })(), e => createInternalError(e)).andThen(r=>r)
    }

    update(requester: IRequester, id: number, c: WarrantyFormCreate): ResultAsync<void, Error> {
        return ResultAsync.fromPromise(
            (async () => {
                const vr = await Validator(warrantyCreateSchema,c)
                if (vr.isErr())
                    return err(vr.error)

                const old = await this.warrantyRepo.findById(id)

                if (old.isErr())
                    return err(old.error)

                if (!old.value)
                    return err(createEntityNotFoundError("Warranty Form"))

                const result = await this.warrantyRepo.update(id,c)
                if (result.isErr())
                    return err(result.error)

                this.pubSub.Publish(topicUpdateWarrantyForm,createMessage({
                    id: id,
                    old: old.value,
                    new: c
                },requester))

                return ok(undefined)
            })(), e => createInternalError(e)
        ).andThen(r=> r)
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
            const newFilter = warrantyFilterSchema.validate(filter, { stripUnknown: true });
            if(newFilter.error) {
                return err(createInvalidRequestError(newFilter.error))
            }

            const r=  await this.warrantyRepo.findMany(newFilter.value,paging)
            if (r.isErr()) {
                return err(createInternalError(r.error))
            }

            return ok(r.value)
        })(),e => createInternalError(e)).andThen(r=>r)
    }
}