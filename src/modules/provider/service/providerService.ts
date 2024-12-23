import {err, ok, ResultAsync} from "neverthrow";
import {IRequester} from "../../../libs/IRequester";
import {Provider, ProviderCreate, providerCreateSchema, ProviderUpdate, providerUpdateSchema} from "../entity/provider";
import {IProviderService} from "./IProviderService";
import {Paging} from "../../../libs/paging";
import {ICondition} from "../../../libs/condition";
import {inject} from "inversify";
import {TYPES} from "../../../types";
import { IPubSub} from "../../../components/pubsub";
import {IProviderRepository} from "../repository/IProviderRepository";
import {Validator} from "../../../libs/validator";
import {createEntityNotFoundError, createForbiddenError, createInternalError, Err} from "../../../libs/errors";
import {SystemRole} from "../../user/entity/user";

export class ProviderService implements IProviderService {

    constructor(
        @inject(TYPES.IProviderRepository) private readonly repo: IProviderRepository,
        @inject(TYPES.IPubSub) private readonly pubSub: IPubSub,
    ) {
    }

    create(requester: IRequester, c: ProviderCreate): ResultAsync<void, Err> {
        // @ts-ignore
        return ResultAsync.fromPromise(
            (async () => {
                const vr = await Validator(providerCreateSchema, c)
                if (vr.isErr())
                    return err(vr.error)

                const result = await this.repo.create(c)
                if (result.isErr())
                    return err(result.error)

                /*this.pubSub.Publish(topicCreateBrand,createMessage(c,requester))*/
                return ok(result.value)
            })(), e => createInternalError(e)
        ).andThen(r => r)
    }

    delete(requester: IRequester, id: number): ResultAsync<void, Err> {
        // @ts-ignore
        return ResultAsync.fromPromise(
            (async () => {
                if (requester.systemRole != SystemRole.Admin &&  requester.systemRole != SystemRole.Owner) {
                    return err(createForbiddenError())
                }

                const old = await this.repo.findById(id)

                if (old.isErr())
                    return err(old.error)

                if (!old.value)
                    return err(createEntityNotFoundError("Provider"))


                const result = await this.repo.delete(id)
                if (result.isErr())
                    return err(result.error)

                /*this.pubSub.Publish(topicDeleteSpu,createMessage(old.value,requester))*/
                return ok(undefined)
            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }

    list(cond: ICondition, paging: Paging): ResultAsync<Provider[] | null, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                const result = await this.repo.list(cond,paging)
                if (result.isErr())
                    return err(result.error)
                return ok(result.value)
            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }

    update(requester: IRequester, id: number, c: ProviderUpdate): ResultAsync<void, Err> {
        // @ts-ignore
        return ResultAsync.fromPromise(
            (async () => {
                const vr = await Validator(providerUpdateSchema,c)
                if (vr.isErr())
                    return err(vr.error)

                const old = await this.repo.findById(id)

                if (old.isErr())
                    return err(old.error)

                if (!old.value)
                    return err(createEntityNotFoundError("Provider"))

                const result = await this.repo.update(id,c)
                if (result.isErr())
                    return err(result.error)

                /*this.pubSub.Publish(topicUpdateSpu,createMessage({
                    id: id,
                    old: old.value,
                    new: c
                },requester))*/

                return ok(undefined)
            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }

    findById(id: number): ResultAsync<Provider | null, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                const result = await this.repo.findById(id)
                if (result.isErr())
                    return err(result.error)
                if (!result.value) {
                    return err(createEntityNotFoundError("Provider"))
                }
                return ok(result.value)
            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }

}