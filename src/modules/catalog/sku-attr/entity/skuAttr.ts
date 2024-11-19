import {Image} from "../../../../libs/image";

export interface SkuAttr {
    id: number;
    spuId: number;
    name: string;
    dataType: string;
    images?: Image[]
    value: any[];
    status : number;
    createdAt : Date | null;
    updatedAt: Date | null;
}
