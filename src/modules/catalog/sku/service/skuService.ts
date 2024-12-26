import {ISkuService} from "./ISkuService";
import {inject, injectable} from "inversify";
import {TYPES} from "../../../../types";
import {ISkuRepository} from "../repository/ISkuRepository";
import {createMessage, IPubSub} from "../../../../components/pubsub";
import {ICondition} from "../../../../libs/condition";
import {Paging} from "../../../../libs/paging";
import {err, ok, ResultAsync} from "neverthrow";
import {Sku} from "../entity/sku";
import {createEntityNotFoundError, createInternalError, Err} from "../../../../libs/errors";
import {IRequester} from "../../../../libs/IRequester";
import {topicDeleteBrand, topicDeleteSku} from "../../../../libs/topics";
import {SkuDetail} from "../entity/skuDetail";

@injectable()
export class SkuService implements ISkuService {
    constructor(
        @inject(TYPES.ISkuRepository) private readonly repo: ISkuRepository,
        @inject(TYPES.IPubSub) private readonly pubSub: IPubSub,
    ) {}

    list(cond: ICondition, paging: Paging): ResultAsync<Sku[] | null, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                const result = await this.repo.list(cond,paging)
                if (result.isErr())
                    return err(result.error)
                return ok(result.value)
            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }

    listDetail(cond: ICondition, paging: Paging): ResultAsync<SkuDetail[] | null, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                const result = await this.repo.listDetail(cond,paging)
                if (result.isErr())
                    return err(result.error)
                if(!result.value)
                    return ok(null)
                // Ghep name spu voi value attribute
                const newNameSkuDetail: string[] = result.value.map(skuDetail => {
                    const nameSpu = skuDetail.spuName
                    const skuTierIdxByAttribute = skuDetail.skuTierIdx?.map((skuTierIdx,index) => {
                        return skuDetail.attributes[index]?.value[skuTierIdx]
                    })
                    return `${nameSpu} - ${skuTierIdxByAttribute?.join(' - ')}`
                })
                const newSkuDetail = result.value.map((skuDetail,index) => {
                    return {
                        ...skuDetail,
                        name: newNameSkuDetail[index],
                    }
                })
                return ok(newSkuDetail)
            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }

    delete(requester: IRequester, id: number): ResultAsync<void, Err> {
        return ResultAsync.fromPromise(
            (async  () => {
                // if(requester.systemRole != SystemRole.Admin && requester.systemRole != SystemRole.Owner) {
                //     return err(createForbiddenError())
                // }

                const old = await this.repo.findById(id)

                if(old.isErr())
                    return err(old.error)

                if(!old.value)
                    return err(createEntityNotFoundError("Sku"))

                const result = await this.repo.delete(id)
                if(result.isErr())
                    return err(result.error)

                this.pubSub.Publish(topicDeleteSku,createMessage(old.value,requester))
                return ok(undefined)
            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }
}