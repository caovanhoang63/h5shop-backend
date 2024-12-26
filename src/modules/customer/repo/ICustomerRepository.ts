import {IBaseRepo} from "../../../libs/IBaseRepo";
import {CustomerCreate} from "../entity/customerCreate";
import {ResultAsync} from "neverthrow";
import {Err} from "../../../libs/errors";
import {CustomerUpdate} from "../entity/customerUpdate";

export interface ICustomerRepository extends IBaseRepo {
    create: (c: CustomerCreate) => ResultAsync<void, Err>;
    update: (id: number, c: CustomerUpdate) => ResultAsync<void, Err>;
    delete: (id: number) => ResultAsync<void, Err>;
}