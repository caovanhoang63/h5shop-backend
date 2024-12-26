import {Err} from "../../../libs/errors";
import {ResultAsync} from "neverthrow";
import {CustomerCreate} from "../entity/customerCreate";
import {IRequester} from "../../../libs/IRequester";
import {CustomerUpdate} from "../entity/customerUpdate";

export interface ICustomerService {
    create(requester: IRequester, c: CustomerCreate): ResultAsync<void, Err>;
    update(requester: IRequester, id: number, c: CustomerUpdate): ResultAsync<void, Err>;
    delete(requester: IRequester, id: number): ResultAsync<void, Err>;
}