import {err, ok, ResultAsync} from "neverthrow";
import {ICondition} from "../../../../libs/condition";
import {createEntityNotFoundError, createInternalError, Err} from "../../../../libs/errors";
import {IRequester} from "../../../../libs/IRequester";
import {Paging} from "../../../../libs/paging";
import {SkuAttr} from "../entity/skuAttr";
import {SkuAttrCreate, skuAttrCreateSchema} from "../entity/skuAttrCreate";
import {SkuAttrUpdate, skuAttrUpdateSchema} from "../entity/skuAttrUdate";
import {ISkuAttrService} from "./ISkuAttrService";
import {inject, injectable} from "inversify";
import {TYPES} from "../../../../types";
import {createMessage, IPubSub} from "../../../../components/pubsub";
import {ISpuRepository} from "../../spu/repository/ISpuRepository";
import {Validator} from "../../../../libs/validator";
import {topicCreateSkuAttr, topicDeleteSkuAttr, topicUpdateSkuAttr} from "../../../../libs/topics";
import {ISkuAttrRepository} from "../repository/ISkuAttrRepository";


@injectable()
export class SkuAttrService implements ISkuAttrService {

    constructor(@inject(TYPES.ISkuAttrRepository) private readonly skuAttrRepository: ISkuAttrRepository,
                @inject(TYPES.IPubSub) private readonly pubSub : IPubSub,
                @inject(TYPES.ISpuRepository) private spuRepo : ISpuRepository) {
    }


    createBulk(requester: IRequester, spuId : number , c: SkuAttrCreate[]): ResultAsync<void, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                for (const create of c) {
                    create.spuId = spuId;
                    const vr = await Validator(skuAttrCreateSchema,create);
                    if (vr.isErr())
                        return err(vr.error)
                }

                const spu = await this.spuRepo.findById(spuId)

                if (spu.isErr()) return err(spu.error)
                if (!spu.value) return err(createEntityNotFoundError("spu"))

                const result = await this.skuAttrRepository.addBulk(c)

                if (result.isErr())
                    return err(result.error);

                for (const create of c) {
                    this.pubSub.Publish(topicCreateSkuAttr,createMessage(create,requester))
                }

                return ok(undefined)
            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }

    create(requester: IRequester, c: SkuAttrCreate): ResultAsync<void, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                const vr = await Validator(skuAttrCreateSchema,c)
                if (vr.isErr())
                    return err(vr.error)

                const spu = await this.spuRepo.findById(c.spuId)

                if (spu.isErr()) return err(spu.error)
                if (!spu.value) return err(createEntityNotFoundError("spu"))

                const result = await this.skuAttrRepository.create(c)
                if (result.isErr())
                    return err(result.error)

                this.pubSub.Publish(topicCreateSkuAttr,createMessage(c,requester))
                return ok(undefined)
            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }

    update(requester: IRequester, id: number, c: SkuAttrUpdate): ResultAsync<void, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                const vr = await Validator(skuAttrUpdateSchema,c)
                if (vr.isErr())
                    return err(vr.error)

                const old = await this.skuAttrRepository.findById(id)

                if (old.isErr()) return err(old.error)
                if (!old.value || old.value.status != 1) return err(createEntityNotFoundError("skuAttr"))

                const result = await this.skuAttrRepository.update(id,c)
                
                if (result.isErr())
                    return err(result.error)

                this.pubSub.Publish(topicUpdateSkuAttr,createMessage({
                    id: id,
                    new: c,
                    old: old.value
                },requester))

                return ok(undefined)
            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }

    delete(requester: IRequester, id: number): ResultAsync<void, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                const old = await this.skuAttrRepository.findById(id)

                if (old.isErr()) return err(old.error)
                if (!old.value) return err(createEntityNotFoundError("skuAttr"))
                if (!old.value || old.value.status != 1) return err(createEntityNotFoundError("skuAttr"))

                const result = await this.skuAttrRepository.delete(id)

                if (result.isErr())
                    return err(result.error)

                this.pubSub.Publish(topicDeleteSkuAttr,createMessage({id: id},requester))
                return ok(undefined)
            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }

    list(cond: ICondition, paging: Paging): ResultAsync<SkuAttr[] | null, Err> {
        return ResultAsync.fromPromise(
            (async () => {

                const result = await this.skuAttrRepository.list(cond,paging)

                if (result.isErr())  return err(result.error)
                return ok(result.value)
            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }

    findById(id: number): ResultAsync<SkuAttr | null, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                const result = await this.skuAttrRepository.findById(id)

                if (result.isErr())  return err(result.error)
                if (!result.value) return err(createEntityNotFoundError("skuAttr"))

                return ok(result.value)
            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }

    upsertMany(requester: IRequester, spuId: number, records: SkuAttrCreate[]): ResultAsync<void, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                for (const create of records) {
                    create.spuId = spuId;
                    const vr = await Validator(skuAttrCreateSchema,create);
                    if (vr.isErr())
                        return err(vr.error)
                }

                const spu = await this.spuRepo.findById(spuId)

                if (spu.isErr()) return err(spu.error)
                if (!spu.value) return err(createEntityNotFoundError("spu"))

                const result = await this.skuAttrRepository.upsertMany(records)

                if (result.isErr())
                    return err(result.error);

                for (const create of records) {
                    this.pubSub.Publish(topicCreateSkuAttr,createMessage(create,requester))
                }

                return ok(undefined)
            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }
}