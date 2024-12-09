import { Nullable } from "../../../libs/nullable";
import {BaseModel} from "../../../libs/baseModel";

export interface InventoryReport extends BaseModel {
    amount: number;
    warehouseMan: Nullable<number>;
    status: number;
    dif: number;
    totalPrice: number;
    note: Nullable<string>;
}
