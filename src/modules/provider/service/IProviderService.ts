import {IRequester} from "../../../libs/IRequester";
import {ResultAsync} from "neverthrow";
import {Err} from "../../../libs/errors";
import {ICondition} from "../../../libs/condition";
import {Paging} from "../../../libs/paging";
import {Provider, ProviderCreate, ProviderUpdate} from "../entity/provider";

export interface IProviderService{
    create(requester: IRequester, c: ProviderCreate): ResultAsync<void, Err>
    /*update(requester: IRequester, id: number, c: ProviderUpdate): ResultAsync<void, Err>
    delete(requester: IRequester, id: number): ResultAsync<void, Err>
    list(cond: ICondition, paging: Paging): ResultAsync<Provider[] | null, Err>*/
}