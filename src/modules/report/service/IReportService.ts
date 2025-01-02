import {ResultAsync} from "neverthrow";
import {Revenue} from "../entity/revenue";


export interface IReportService {
    revenue(startDate : Date, endDate : Date) : ResultAsync<Revenue[], Error>;
    totalOrder(startDate : Date, endDate : Date) : ResultAsync<number, Error>;

}