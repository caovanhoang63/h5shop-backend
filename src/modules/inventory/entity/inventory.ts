import {BaseModel} from "../../../libs/baseModel";

export interface Inventory extends BaseModel{
    skuId : number;
    amount: string;
    status : string;
}

import { Nullable } from "../../../libs/nullable";

export interface InventoryItemCreate extends BaseModel {
    skuId : number;
    amount: number;
}

