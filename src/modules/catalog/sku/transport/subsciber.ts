import {ISkuService} from "../service/ISkuService";
import {ResultAsync} from "neverthrow";
import {Err} from "../../../../libs/errors";
import {IRequester} from "../../../../libs/IRequester";
import {Audit} from "../../../audit/entity/audit";
import _ from "lodash";
import {SubHandler} from "../../../../components/subcriber";

export class SkuSubscriberHandler{
    constructor(private readonly skuService: ISkuService){}

    onUpdate():SubHandler{
        return (m): ResultAsync<void, Err> => {
            return ResultAsync.fromPromise(
                (async () => {
                    const requester: IRequester = m.data.requester


                })(),
                e => e as Err
            )
        }
    }

}