import {IStockInService} from "../service/IStockInService";
import {SubHandler} from "../../../../components/subcriber";
import {ResultAsync} from "neverthrow";
import {Err} from "../../../../libs/errors";
import {IRequester} from "../../../../libs/IRequester";
import {Audit} from "../../../audit/entity/audit";
import _ from "lodash";


export class StockInSubscriberHandler {
    constructor(private readonly stockInService: IStockInService) {
    }

    onCreate(entity:string) :SubHandler{
        return (m):ResultAsync<void,Err> =>{
            return ResultAsync.fromPromise(
                (async () => {

                })(),
                e => e as Err
            )
        }
    }
}