import {Image, imageSchema} from "../../../../libs/image";
import {SkuCreate, skuCreateSchema} from "../../sku/entity/skuCreate";
import {SkuAttrCreate, skuAttrCreateSchema} from "../../sku-attr/entity/skuAttrCreate";
import Joi from "joi";

export interface SpuDetailUpsert{
    id?: number;
    name: string;
    description: string;
    categoryId: number,
    brandId: number,
    metadata: any,
    images? : Image,
    skus: SkuCreate[]
    attrs: SkuAttrCreate[]
}

export const spuDetailUpsertSchema = Joi.object({
    id: Joi.number(),
    name: Joi.string().max(255).required(),
    description: Joi.string().max(255).required(),
    categoryId: Joi.number().required(),
    brandId: Joi.number().required(),
    metadata: Joi.object(),
    image: imageSchema,
    skus: Joi.array().items(skuCreateSchema),
    attrs: Joi.array().items(skuAttrCreateSchema)
})