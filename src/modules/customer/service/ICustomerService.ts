import {Err} from "../../../libs/errors";
import {ResultAsync} from "neverthrow";
import {CustomerCreate} from "../entity/customerCreate";
import {IRequester} from "../../../libs/IRequester";
import {CustomerUpdate} from "../entity/customerUpdate";
import {Customer} from "../entity/customer";

export interface ICustomerService {
    create(requester: IRequester, c: CustomerCreate): ResultAsync<Customer, Err>;
    update(requester: IRequester, id: string, c: CustomerUpdate): ResultAsync<Customer, Err>;
    delete(requester: IRequester, id: string): ResultAsync<void, Err>;
    findById(requester: IRequester, id: string): ResultAsync<Customer, Err>;
    list(requester: IRequester): ResultAsync<Customer[], Err>;
    increasePaymentAmount(id: string): ResultAsync<void, Err>
}