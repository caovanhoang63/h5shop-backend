import {IBrandService} from "./IBrandService";
import {inject, injectable} from "inversify";
import {IBrandRepository} from "../repository/IBrandRepository";
import {TYPES} from "../../../../types";
import {createMessage, IPubSub} from "../../../../components/pubsub";
import {IRequester} from "../../../../libs/IRequester";
import {BrandCreate, brandCreateScheme} from "../entity/brandCreate";
import {err, ok, ResultAsync} from "neverthrow";
import {createEntityNotFoundError, createInternalError, Err} from "../../../../libs/errors";
import {Validator} from "../../../../libs/validator";
import {topicCreateBrand, topicUpdateBrand} from "../../../../libs/topics";
import {BrandUpdate, brandUpdateScheme} from "../entity/brandUpdate";
import {Brand} from "../entity/brand";

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
        throw new Error("Method not implemented.");
    }

    delete(requester: IRequester, id: number): ResultAsync<void, Err> {
        throw new Error("Method not implemented.");
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