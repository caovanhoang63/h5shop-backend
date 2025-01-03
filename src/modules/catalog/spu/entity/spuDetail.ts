import {Image} from "../../../../libs/image";

export interface SpuDetail{
    id: number;
    name: string;
    brandId: number;
    brandName: string;
    categoryId: number;
    categoryName: string;
    description: string;
    metadata: any;
    timeReturn?: number;
    timeWarranty?: number;
    typeTimeWarranty?: string;
    typeTimeReturn?: string;
    images? : Image[];
    outOfStock : boolean;
    status : number;
    attrs : Attr[];
    skus : Sku[];
    providers : SkuProvider[];
}

interface Attr {
    id: number;
    spuId: number;
    name: string;
    dataType: string;
    images?: Image;
    value: any[];
}

interface Sku {
    id: number;
    spuId: number;
    skuTierIdx?: number[];
    images?: Image[],
    costPrice: number;
    price: number;
    stock: number;
    wholesalePrices: SkuWholesalePrice[],
}

interface SkuWholesalePrice {
    id: number;
    skuId: number;
    minQuantity: number;
    price: number;
}

interface SkuProvider {
    id: number;
    name: string;
    phone: string;
    email: string;
}