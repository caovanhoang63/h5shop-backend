import {Image} from "../../../../libs/image";
import {Category} from "../../category/entity/category";
import {Brand} from "../../brand/entity/brand";
import {Sku} from "../../sku/entity/sku";
import {SkuAttr} from "../../sku-attr/entity/skuAttr";

export interface SpuGetDetail {
    id: number;
    name: string;
    description: string;
    metadata: any,
    brandId: number,
    categoryId: number,
    images? : Image,
    outOfStock : boolean,
    category: Category,
    brand: Brand,
    skus: Sku[],
    attrs: SkuAttr[],
}


