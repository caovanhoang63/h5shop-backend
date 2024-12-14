import {IBrandService} from "./IBrandService";
import {inject, injectable} from "inversify";
import {IBrandRepository} from "../repository/IBrandRepository";
import {TYPES} from "../../../../types";
import {createMessage, IPubSub} from "../../../../components/pubsub";
import {IRequester} from "../../../../libs/IRequester";
import {BrandCreate, brandCreateScheme} from "../entity/brandCreate";
import {err, ok, ResultAsync} from "neverthrow";
import {createEntityNotFoundError, createForbiddenError, createInternalError, Err} from "../../../../libs/errors";
import {Validator} from "../../../../libs/validator";
import {topicCreateBrand, topicDeleteBrand, topicUpdateBrand} from "../../../../libs/topics";
import {BrandUpdate, brandUpdateScheme} from "../entity/brandUpdate";
import {Brand} from "../entity/brand";
import {SystemRole} from "../../../user/entity/user";

@injectable()
export class BrandService implements IBrandService{
    constructor(
        @inject(TYPES.IBrandRepository) private readonly repo : IBrandRepository,
        @inject(TYPES.IPubSub) private readonly pubSub : IPubSub,
    ) {}

    create(requester: IRequester, c: BrandCreate): ResultAsync<void, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                const vr = await Validator(brandCreateScheme,c)
                if (vr.isErr())
                    return err(vr.error)

                const result = await this.repo.create(c)
                if (result.isErr())
                    return err(result.error)

                this.pubSub.Publish(topicCreateBrand,createMessage(c,requester))
                return ok(undefined)
            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }

    update(requester: IRequester, id: number, c: BrandUpdate): ResultAsync<void, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                const vr = await Validator(brandUpdateScheme,c)
                if (vr.isErr())
                    return err(vr.error)

                const old = await this.repo.findById(id)

                if (old.isErr())
                    return err(old.error)

                if (!old.value)
                    return err(createEntityNotFoundError("Brand"))

                const result = await this.repo.update(id,c)
                if (result.isErr())
                    return err(result.error)

                this.pubSub.Publish(topicUpdateBrand,createMessage({
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
            (async  () => {
                if(requester.systemRole != SystemRole.Admin && requester.systemRole != SystemRole.Owner) {
                    return err(createForbiddenError())
                }

                const old = await this.repo.findById(id)

                if(old.isErr())
                    return err(old.error)

                if(!old.value)
                    return err(createEntityNotFoundError("Brand"))

                const result = await this.repo.delete(id)
                if(result.isErr())
                    return err(result.error)

                this.pubSub.Publish(topicDeleteBrand,createMessage(old.value,requester))
                return ok(undefined)
            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }

    list(cond: any, paging: any): ResultAsync<Brand[] | null, Err> {
        return ResultAsync.fromPromise(
            (async () => {

                const result = await this.repo.list(cond, paging)
                if (result.isErr())
                    return err(result.error)

                return ok(result.value)
            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }

    findById(id: number): ResultAsync<Brand | null, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                const result = await this.repo.findById(id)
                if (result.isErr())
                    return err(result.error)
                if(!result.value)
                    return err(createEntityNotFoundError("Brand"))

                return ok(result.value)
            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }
}