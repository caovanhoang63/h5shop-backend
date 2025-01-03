import {ResultAsync} from "neverthrow";
import {Revenue} from "../entity/revenue";
import {SkuOrder} from "../entity/skuOrder";
import {Sale} from "../entity/sale";


export interface IReportRepo {
    revenue(startDate : Date, endDate : Date) : ResultAsync<Revenue[], Error>;
    totalOrder(startDate : Date, endDate : Date) : ResultAsync<number, Error>;
    skuOrder(startDate: Date, endDate: Date,limit : number, order: string): ResultAsync<SkuOrder[], Error>
    sale(startDate: Date, endDate: Date): ResultAsync<Sale[], Error>
}