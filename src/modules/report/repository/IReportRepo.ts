import {ResultAsync} from "neverthrow";
import {Revenue} from "../entity/revenue";
import {SkuOrder} from "../entity/skuOrder";


export interface IReportRepo {
    revenue(startDate : Date, endDate : Date) : ResultAsync<Revenue[], Error>;
    totalOrder(startDate : Date, endDate : Date) : ResultAsync<number, Error>;
    skuOrder(startDate: Date, endDate: Date,limit : number, order: string): ResultAsync<SkuOrder[], Error>
}