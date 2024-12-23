import {IBaseRepo} from "../../../libs/IBaseRepo";
import {Provider, ProviderCreate} from "../entity/provider";
import {ResultAsync} from "neverthrow";
import {ICondition} from "../../../libs/condition";
import {Paging} from "../../../libs/paging";
import {Err} from "../../../libs/errors";

export interface IProviderRepository extends IBaseRepo {
    create: (provider: ProviderCreate) => ResultAsync<number, Error>
    update: (id:number,provider: Partial<Provider>)=> ResultAsync<void, Error>
    delete: (id:number)=> ResultAsync<void, Error>
    list(cond : ICondition, paging : Paging): ResultAsync<Provider[] | null , Err>
}