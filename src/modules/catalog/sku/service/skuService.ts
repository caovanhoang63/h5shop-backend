import {ISkuService} from "./ISkuService";
import {inject, injectable} from "inversify";
import {TYPES} from "../../../../types";
import {ISkuRepository} from "../repository/ISkuRepository";
import {createMessage, IPubSub} from "../../../../components/pubsub";
import {ICondition} from "../../../../libs/condition";
import {Paging} from "../../../../libs/paging";
import {err, ok, ResultAsync} from "neverthrow";
import {Sku} from "../entity/sku";
import {createEntityNotFoundError, createInternalError, createInvalidDataError, Err} from "../../../../libs/errors";
import {IRequester} from "../../../../libs/IRequester";
import {topicDeleteBrand, topicDeleteSku} from "../../../../libs/topics";
import {SkuDetail} from "../entity/skuDetail";
import {FilterSkuListDetail, SkuListDetail, SkuWholesalePriceListDetail} from "../entity/skuListDetail";
import {FilterSkuGetWholeSale, filterSkuGetWholeSaleSchema, SkuIdAndWholeSalePrice} from "../entity/skuGetWholeSale";

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

    searchDetail(cond: ICondition, paging: Paging): ResultAsync<SkuDetail[] | null, Err> {
        return ResultAsync.fromPromise(
            (async () => {

                const result = await this.repo.searchDetail(cond,paging)
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
                    return `${nameSpu} ${skuTierIdxByAttribute?.join(' ')}`
                })
                const newSkuDetail = result.value.map((skuDetail,index) => {
                    return {
                        ...skuDetail,
                        name: newNameSkuDetail[index],
                        attributes: [],
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

    listDetail(cond: FilterSkuListDetail, paging: Paging): ResultAsync<SkuListDetail[] | null, Err> {
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
                    return `${nameSpu} ${skuTierIdxByAttribute?.join(' ')}`
                })
                const newSkuDetail = result.value.map((skuDetail,index) => {
                    return {
                        ...skuDetail,
                        name: newNameSkuDetail[index],
                        attributes: [],
                    }
                })
                return ok(newSkuDetail)
            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }

    getDetailById(id: number): ResultAsync<SkuListDetail | null, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                const result = await this.repo.getDetailById(id)
                if (result.isErr())
                    return err(result.error)
                if(!result.value)
                    return ok(null)
                // Ghep name spu voi value attribute
                const nameSpu = result.value.spuName
                const skuTierIdxByAttribute = result.value.skuTierIdx?.map((skuTierIdx,index) => {
                    return result?.value?.attributes[index]?.value[skuTierIdx]
                })
                const newNameSkuDetail = `${nameSpu} ${skuTierIdxByAttribute?.join(' ')}`
                const newSkuDetail = {
                    ...result.value,
                    name: newNameSkuDetail,
                    attributes: [],
                }
                return ok(newSkuDetail)
            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }

    getListWholeSale(filter: FilterSkuGetWholeSale[]): ResultAsync<SkuIdAndWholeSalePrice[] | null, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                const filterValidate = filterSkuGetWholeSaleSchema.validate(filter)
                if(filterValidate.error)
                {
                    return err(createInvalidDataError(filterValidate.error))
                }

                const ids = filter.map(f => f.ids)
                const result = await this.repo.findDetailByIds(ids)

                if (result.isErr())
                {
                    return err(result.error)
                }
                if(!result.value)
                {
                    return ok([])
                }

                const data: SkuIdAndWholeSalePrice[] = result.value.map((sku,index) => {
                    const id = sku.id
                    const priceWhole = this.getListPriceByQuantity(sku.wholesalePrices,filter[index].quantity,sku.price)
                    return {
                        id,
                        price: priceWhole.price,
                        isWholeSale: priceWhole.isWholeSale
                    }
                })

                return ok(data)

            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }

    getListPriceByQuantity(wholeSale: SkuWholesalePriceListDetail[], quantity: number, priceDefault: number): {price: number, isWholeSale: boolean} {
        let isWholeSale = false
        const wholePrice = wholeSale.reduce((acc,wholeSale) => {
            if(quantity >= wholeSale.minQuantity)
            {
                isWholeSale = true
                return wholeSale.price
            }
            return priceDefault
        },0)
        return {price: wholePrice, isWholeSale: isWholeSale}
    }
}