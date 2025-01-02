import {IBaseRepo} from "../../../libs/IBaseRepo";
import {CustomerCreate} from "../entity/customerCreate";
import {ResultAsync} from "neverthrow";
import {Err} from "../../../libs/errors";
import {CustomerUpdate} from "../entity/customerUpdate";
import {Customer} from "../entity/customer";
import {CustomerFilter} from "../entity/customerFilter";
import {Paging} from "../../../libs/paging";

export interface ICustomerRepository extends IBaseRepo {
    create: (c: CustomerCreate) => ResultAsync<Customer, Err>;
    update: (id: number, c: CustomerUpdate) => ResultAsync<Customer, Err>;
    delete: (id: number) => ResultAsync<void, Err>;
    findById: (id: number) => ResultAsync<Customer, Err>;
    list: (cond: CustomerFilter, page: Paging) => ResultAsync<Customer[], Err>
    increasePaymentAmount: (userId: number,discountPoint : number) => ResultAsync<void, Err>
}