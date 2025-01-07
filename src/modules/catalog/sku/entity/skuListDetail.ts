import {Image} from "../../../../libs/image";

export interface SkuListDetail{
    id: number;
    name: string;
    spuName: string;
    spuId: number;
    brandName: string;
    categoryName: string;
    skuTierIdx?: number[];
    images?: Image[],
    costPrice: number;
    price: number;
    stock: number;
    timeWarranty: number;
    timeReturn: number;
    typeTimeWarranty: string;
    typeTimeReturn: string;
    attributes: SkuAttrListDetail[]
    wholesalePrices: SkuWholesalePriceListDetail[];
}

export interface SkuAttrListDetail {
    name: string;
    value: string[];
}

export interface SkuWholesalePriceListDetail {
    minQuantity: number;
    price: number;
}

export interface FilterSkuListDetail {
    categoryId?: number;
    brandId?: number;
}