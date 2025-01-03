import {ResultAsync} from "neverthrow";
import {Revenue} from "../entity/revenue";
import {SkuOrder} from "../entity/skuOrder";
import {Sale} from "../entity/sale";
import {SkuWarningStock} from "../../catalog/sku/entity/skuWarningStock";
import {Err} from "../../../libs/errors";
import {SkuStock} from "../entity/skuStock";


export interface IReportService {
    revenue(startDate : Date, endDate : Date) : ResultAsync<Revenue[], Error>;
    totalOrder(startDate : Date, endDate : Date) : ResultAsync<number, Error>;
    skuOrder(startDate: Date, endDate: Date,limit : number, order: string): ResultAsync<SkuOrder[], Error>
    sale(startDate: Date, endDate: Date): ResultAsync<Sale[], Error>
    inventory(gtStock : number,ltStock: number) : ResultAsync<SkuStock[], Error>
}