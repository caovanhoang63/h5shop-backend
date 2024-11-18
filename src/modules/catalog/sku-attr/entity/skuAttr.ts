
export interface SkuAttr {
    id: number;
    spuId: number;
    name: string;
    description: string;
    dataType: string;
    value: string;
    status : number;
    createdAt : Date | null;
    updatedAt: Date | null;
}
