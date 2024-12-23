import {IBaseRepo} from "../../../libs/IBaseRepo";
import {Provider, ProviderCreate, ProviderUpdate} from "../entity/provider";
import {ResultAsync} from "neverthrow";
import {ICondition} from "../../../libs/condition";
import {Paging} from "../../../libs/paging";
import {Err} from "../../../libs/errors";

export interface IProviderRepository extends IBaseRepo {
    create: (provider: ProviderCreate) => ResultAsync<void, Error>
    update: (id:number,provider: ProviderUpdate)=> ResultAsync<void, Error>
    delete: (id:number)=> ResultAsync<void, Error>
    list(cond : ICondition, paging : Paging): ResultAsync<Provider[] | null , Err>
}