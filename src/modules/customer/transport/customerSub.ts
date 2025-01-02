import {SubHandler} from "../../../components/subcriber";
import {Err} from "../../../libs/errors";
import {ICustomerService} from "../service/ICustomerService";
import {ResultAsync} from "neverthrow";
import {OrderType} from "../../order/order/entity/order";

export class CustomerSubCribeHandler {
    constructor(private readonly customerService: ICustomerService) {
    }

    onPaymentSuccess() : SubHandler {
        return (m) : ResultAsync<void, Err> => {
            return ResultAsync.fromPromise(
                (async () => {
                    if (m.data.data.orderType == OrderType.Retail) {
                        const r = await this.customerService.increasePaymentAmount(m.data.data.customerId,m.data.data.finalAmount );
                        if (r.isErr()) {
                            console.log(r.error)
                        }
                    }
                })(),
                e => e as Err
            )
        }
    }
}