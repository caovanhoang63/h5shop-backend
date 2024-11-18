import {image} from "../../../../libs/image";

export interface Spu {
    id: number;
    name: string;
    description: string;
    metadata: any,
    image? : image[],
    outOfStock : boolean,
    status : number,
    createdAt : Date | null;
    updatedAt : Date | null;
}

