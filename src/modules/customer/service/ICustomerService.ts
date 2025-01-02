import {Err} from "../../../libs/errors";
import {ResultAsync} from "neverthrow";
import {CustomerCreate} from "../entity/customerCreate";
import {IRequester} from "../../../libs/IRequester";
import {CustomerUpdate} from "../entity/customerUpdate";
import {Customer} from "../entity/customer";
import {CustomerFilter} from "../entity/customerFilter";
import {Paging} from "../../../libs/paging";

export interface ICustomerService {
    create(requester: IRequester, c: CustomerCreate): ResultAsync<Customer, Err>;
    update(requester: IRequester, id: number, c: CustomerUpdate): ResultAsync<Customer, Err>;
    delete(requester: IRequester, id: number): ResultAsync<void, Err>;
    findById(id: number): ResultAsync<Customer, Err>;
    list(filter: CustomerFilter, page: Paging): ResultAsync<Customer[], Err>;
    increasePaymentAmount(userId: number,finalAmount : number): ResultAsync<void, Err>
}