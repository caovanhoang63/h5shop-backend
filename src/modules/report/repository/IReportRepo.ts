import {ResultAsync} from "neverthrow";
import {Revenue} from "../entity/revenue";
import {SkuOrder} from "../entity/skuOrder";
import {Sale} from "../entity/sale";
import {SkuStock} from "../entity/skuStock";
import {Category} from "../entity/category";


export interface IReportRepo {
    revenue(startDate : Date, endDate : Date) : ResultAsync<Revenue[], Error>;
    totalOrder(startDate : Date, endDate : Date) : ResultAsync<number, Error>;
    skuOrder(startDate: Date, endDate: Date,limit : number, order: string): ResultAsync<SkuOrder[], Error>
    sale(startDate: Date, endDate: Date): ResultAsync<Sale[], Error>
    inventory(gtStock : number,ltStock: number) : ResultAsync<SkuStock[], Error>
    category(startDate: Date, endDate: Date): ResultAsync<Category[], Error>
}