import {Image} from "../../../../libs/image";

export interface Spu {
    id: number;
    name: string;
    description: string;
    metadata: any,
    brandId: number,
    categoryId: number,
    brandName: string,
    categoryName: string,
    images? : Image,
    outOfStock : boolean,
    status : number,
    createdAt : Date | null;
    updatedAt : Date | null;
}

