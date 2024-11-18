import {err, ok, ResultAsync} from "neverthrow";
import {ICondition} from "../../../../libs/condition";
import {createEntityNotFoundError, createForbiddenError, createInternalError, Err} from "../../../../libs/errors";
import {IRequester} from "../../../../libs/IRequester";
import {Paging} from "../../../../libs/paging";
import {ISpuService} from "./ISpuService";
import {inject, injectable} from "inversify";
import {TYPES} from "../../../../types";
import {ISpuRepository} from "../repository/ISpuRepository";
import {Validator} from "../../../../libs/validator";
import {SystemRole} from "../../../user/entity/user";
import {createMessage, IPubSub} from "../../../../components/pubsub";
import {topicCreateSpu, topicDeleteSpu, topicUpdateSpu} from "../../../../libs/topics";
import {SpuUpdate, spuUpdateSchema} from "../entity/spuUpdate";
import {SpuCreate, spuCreateSchema} from "../entity/spuCreate";
import {Spu} from "../entity/spu";

@injectable()
export class SpuService implements ISpuService {
    constructor(@inject(TYPES.ISpuRepository) private readonly repo : ISpuRepository,
                @inject(TYPES.IPubSub) private readonly pubSub : IPubSub,) {
    }

    create(requester: IRequester, c: SpuCreate): ResultAsync<void, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                const vr = await Validator(spuCreateSchema,c)
                if (vr.isErr())
                    return err(vr.error)

                const result = await this.repo.create(c)
                if (result.isErr())
                    return err(result.error)

                this.pubSub.Publish(topicCreateSpu,createMessage(c,requester))
                return ok(undefined)
            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }

    update(requester: IRequester, id: number, c: SpuUpdate): ResultAsync<void, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                const vr = await Validator(spuUpdateSchema,c)
                if (vr.isErr())
                    return err(vr.error)

                const old = await this.repo.findById(id)

                if (old.isErr())
                    return err(old.error)

                if (!old.value)
                    return err(createEntityNotFoundError("Spu"))

                const result = await this.repo.update(id,c)
                if (result.isErr())
                    return err(result.error)

                this.pubSub.Publish(topicUpdateSpu,createMessage({
                    id: id,
                    old: old.value,
                    new: c
                },requester))

                return ok(undefined)
            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }

    delete(requester: IRequester, id: number): ResultAsync<void, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                if (requester.systemRole != SystemRole.Admin &&  requester.systemRole != SystemRole.Owner) {
                    return err(createForbiddenError())
                }

                const old = await this.repo.findById(id)

                if (old.isErr())
                    return err(old.error)

                if (!old.value)
                    return err(createEntityNotFoundError("Spu"))


                const result = await this.repo.delete(id)
                if (result.isErr())
                    return err(result.error)

                this.pubSub.Publish(topicDeleteSpu,createMessage(old.value,requester))
                return ok(undefined)
            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }

    list(cond: ICondition, paging: Paging): ResultAsync<Spu[] | null, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                const result = await this.repo.list(cond,paging)
                if (result.isErr())
                    return err(result.error)
                return ok(result.value)
            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }

    findById(id: number): ResultAsync<Spu | null, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                const result = await this.repo.findById(id)
                if (result.isErr())
                    return err(result.error)
                if (!result.value) {
                    return err(createEntityNotFoundError("Spu"))
                }
                return ok(result.value)
            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }
}