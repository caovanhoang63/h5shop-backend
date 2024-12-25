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
import {ICategoryRepository} from "../../category/repository/ICategoryRepository";
import {SpuDetailUpsert, spuDetailUpsertSchema} from "../entity/spuDetailUpsert";
import {ISkuAttrRepository} from "../../sku-attr/repository/ISkuAttrRepository";
import {ISkuRepository} from "../../sku/repository/ISkuRepository";
import {IBrandRepository} from "../../brand/repository/IBrandRepository";
import {ISkuWholesalePriceRepository} from "../../sku-wholesale-prices/repository/ISkuWholesalePriceRepository";
import {SkuWholesalePriceCreate} from "../../sku-wholesale-prices/entity/SkuWholesalePriceCreate";
import {IUploadProvider} from "../../../../components/uploadProvider/IUploadProvider";
import {SpuDetail} from "../entity/spuDetail";

@injectable()
export class SpuService implements ISpuService {
    constructor(@inject(TYPES.ISpuRepository) private readonly repo : ISpuRepository,
                @inject(TYPES.ICategoryRepository) private readonly categoryRepository: ICategoryRepository,
                @inject(TYPES.ISkuAttrRepository) private readonly skuAttrRepository: ISkuAttrRepository,
                @inject(TYPES.ISkuRepository) private readonly skuRepository: ISkuRepository,
                @inject(TYPES.IBrandRepository) private readonly brandRepository: IBrandRepository,
                @inject(TYPES.ISkuWholesalePriceRepository) private readonly skuWholesalePriceRepository: ISkuWholesalePriceRepository,
                @inject(TYPES.IUploadProvider) private readonly uploadProvider: IUploadProvider,
                @inject(TYPES.IPubSub) private readonly pubSub : IPubSub,) {
    }

    create(requester: IRequester, c: SpuCreate): ResultAsync<void, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                const vr = await Validator(spuCreateSchema,c)
                if (vr.isErr())
                    return err(vr.error)

                const cate =  await this.categoryRepository.findById(c.categoryId);
                if (cate.isErr()) {
                    return err(cate.error)
                }

                if (!cate.value) {
                    return err(createEntityNotFoundError("category"))
                }

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

    upsertSpuDetail(requester: IRequester, c: SpuDetailUpsert): ResultAsync<void, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                const vr = await Validator(spuDetailUpsertSchema,c)
                if (vr.isErr())
                    return err(vr.error)
                // Fetch category and brand
                const [category, brand] = await Promise.all([
                    this.categoryRepository.findById(c.categoryId),
                    this.brandRepository.findById(c.brandId)
                ]);
                if (category.isErr()) return err(category.error);
                if (brand.isErr()) return err(brand.error);

                // Upsert SPU
                const spuUpsert: SpuCreate = {
                    id: c.id,
                    name: c.name,
                    description: c.description,
                    categoryId: c.categoryId,
                    brandId: c.brandId,
                    metadata: c.metadata,
                    images: c.images
                };

                await this.repo.Begin();
                const spuResult = await this.repo.upsert(spuUpsert);
                if (spuResult.isErr()) {
                    await this.repo.Rollback();
                    return err(spuResult.error);
                }
                const spuId = spuResult.value;

                // Set spuId for attrs and skus
                c.attrs.forEach(attr => { attr.spuId = spuId; });
                c.skus.forEach(sku => { sku.spuId = spuId; });

                // upsert attrs
                await this.skuAttrRepository.Begin()
                const resultAttr = await this.skuAttrRepository.upsertMany(c.attrs)
                if (resultAttr.isErr()) {
                    await this.skuAttrRepository.Rollback()
                    await this.repo.Rollback()
                    return err(resultAttr.error)
                }

                // upsert skus
                await this.skuRepository.Begin()
                const resultSku = await this.skuRepository.upsertMany(c.skus)
                if (resultSku.isErr()) {
                    await this.skuRepository.Rollback()
                    await this.skuAttrRepository.Rollback()
                    await this.repo.Rollback()
                    return err(resultSku.error)
                }

                // Set skuId for skuWholeSalePrices
                const skuWholesalePricesData: SkuWholesalePriceCreate[] = []
                resultSku.value.forEach((sku) => {
                    sku.wholesalePrices?.forEach((wholesalePrice) => {
                       wholesalePrice.skuId = sku.id??0;
                       skuWholesalePricesData.push(wholesalePrice);
                    });
                });

                // upsert skuWholeSalePrices
                await this.skuWholesalePriceRepository.Begin()
                const resultSkuWholesalePrices = await this.skuWholesalePriceRepository.upsertMany(skuWholesalePricesData)
                if (resultSkuWholesalePrices.isErr()) {
                    await this.skuWholesalePriceRepository.Rollback()
                    await this.skuRepository.Rollback()
                    await this.skuAttrRepository.Rollback()
                    await this.repo.Rollback()
                    return err(resultSkuWholesalePrices.error)
                }

                // await commit all
                await Promise.all([
                    this.repo.Commit(),
                    this.skuAttrRepository.Commit(),
                    this.skuRepository.Commit(),
                    this.skuWholesalePriceRepository.Commit()
                ]);

                return ok(undefined)
            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }

    getDetail(id: number): ResultAsync<SpuDetail | null, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                const result = await this.repo.getDetail(id)
                if (result.isErr())
                    return err(result.error)
                if (!result.value) {
                    return err(createEntityNotFoundError("Spu detail"))
                }
                return ok(result.value)
            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }
}