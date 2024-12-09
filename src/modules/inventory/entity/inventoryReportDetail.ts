import { Nullable } from "../../../libs/nullable";
import {BaseModel} from "../../../libs/baseModel";

export interface InventoryReportDetail extends BaseModel {
    skuId: string;
    name: string;
    amount: number;
    inventoryDif:number;
    isTrue:boolean;
    actualQuantity: Nullable<number>;
    varianceValue: Nullable<number>;
}
