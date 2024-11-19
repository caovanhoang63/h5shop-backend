import {Image} from "../../../../libs/image";


export interface Category {
    id : number;
    name : string;
    level: number;
    parentId: number | null;
    image?: Image;
    status: number
    createdAt: Date | null;
    updatedAt: Date | null;
}

