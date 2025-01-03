import {Image} from "../../../../libs/image";

export interface SkuWarningStock {
    id: number;
    name: string;
    spuName: string;
    skuTierIdx?: number[];
    stock: number;
    attributes: SkuAttrWarningStock[]
}

export interface SkuAttrWarningStock {
    name: string;
    value: string[];
}
