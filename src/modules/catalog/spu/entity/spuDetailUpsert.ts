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
    timeWarranty?: number,
    timeReturn?: number,
    typeTimeWarranty?: string,
    typeTimeReturn?: string,
    images? : Image[],
    skus: SkuCreate[],
    attrs: SkuAttrCreate[],
}

export const spuDetailUpsertSchema = Joi.object({
    id: Joi.number().allow(null),
    name: Joi.string().max(255).required(),
    description: Joi.string().max(255).allow(""),
    categoryId: Joi.number().required(),
    brandId: Joi.number().required(),
    metadata: Joi.object(),
    timeWarranty: Joi.number().allow(null),
    timeReturn: Joi.number().allow(null),
    typeTimeWarranty: Joi.string().allow(null),
    typeTimeReturn: Joi.string().allow(null),
    images: Joi.array().items(imageSchema),
    skus: Joi.array().items(skuCreateSchema),
    attrs: Joi.array().items(skuAttrCreateSchema)
})