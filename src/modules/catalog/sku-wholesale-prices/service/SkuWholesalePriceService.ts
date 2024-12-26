import {ISkuWholesalePriceService} from "./ISkuWholesalePriceService";
import {inject, injectable} from "inversify";
import {ISkuWholesalePriceRepository} from "../repository/ISkuWholesalePriceRepository";
import {TYPES} from "../../../../types";
import {createMessage, IPubSub} from "../../../../components/pubsub";
import {IRequester} from "../../../../libs/IRequester";
import {err, ok, ResultAsync} from "neverthrow";
import {createEntityNotFoundError, createForbiddenError, createInternalError, Err} from "../../../../libs/errors";
import {ICondition} from "../../../../libs/condition";
import {Paging} from "../../../../libs/paging";
import {SkuWholesalePrice} from "../entity/SkuWholesalePrice";
import {SystemRole} from "../../../user/entity/user";
import {topicDeleteSkuWholeSalePrice} from "../../../../libs/topics";

@injectable()
export class SkuWholesalePriceService implements  ISkuWholesalePriceService {
    constructor(
        @inject(TYPES.ISkuWholesalePriceRepository) private readonly repo: ISkuWholesalePriceRepository,
        @inject(TYPES.IPubSub) private readonly pubSub: IPubSub,
    ) {}

    delete(requester: IRequester, id: number): ResultAsync<void, Err> {
        return ResultAsync.fromPromise(
            (async () =>{
                // if(requester.systemRole != SystemRole.Admin && requester.systemRole != SystemRole.Owner) {
                //     return err(createForbiddenError())
                // }

                const old = await this.repo.findById(id)
                if(old.isErr())
                    return err(old.error)

                if(!old.value)
                    return err(createEntityNotFoundError("Sku Wholesale Price"))

                const result = await this.repo.delete(id)
                if(result.isErr())
                    return err(result.error)

                this.pubSub.Publish(topicDeleteSkuWholeSalePrice,createMessage(old.value,requester))
                return ok(undefined)
            })(), e => createInternalError(e)
        ).andThen(r => r)
    }

    list(cond: ICondition, paging: Paging): ResultAsync<SkuWholesalePrice[] | null, Err> {
        return ResultAsync.fromPromise(
            (async () => {

                const result = await this.repo.list(cond, paging)
                if (result.isErr())
                    return err(result.error)

                return ok(result.value)
            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }

    findById(id: number): ResultAsync<SkuWholesalePrice | null, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                const result = await this.repo.findById(id)
                if (result.isErr())
                    return err(result.error)
                if(!result.value)
                    return err(createEntityNotFoundError("Sku Wholesale Price"))

                return ok(result.value)
            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }
}