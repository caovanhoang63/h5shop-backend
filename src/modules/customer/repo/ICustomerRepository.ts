import {IBaseRepo} from "../../../libs/IBaseRepo";
import {CustomerCreate} from "../entity/customerCreate";
import {ResultAsync} from "neverthrow";
import {Err} from "../../../libs/errors";
import {CustomerUpdate} from "../entity/customerUpdate";
import {Customer} from "../entity/customer";

export interface ICustomerRepository extends IBaseRepo {
    create: (c: CustomerCreate) => ResultAsync<Customer, Err>;
    update: (id: string, c: CustomerUpdate) => ResultAsync<Customer, Err>;
    delete: (id: string) => ResultAsync<void, Err>;
    findById: (id: string) => ResultAsync<Customer, Err>;
    list: () => ResultAsync<Customer[], Err>
    increasePaymentAmount: (id: string) => ResultAsync<void, Err>
}