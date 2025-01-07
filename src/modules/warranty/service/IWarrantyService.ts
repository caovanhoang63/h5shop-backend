import {IRequester} from "../../../libs/IRequester";
import {WarrantyFormCreate} from "../entity/warrantyFormCreate";
import {ResultAsync} from "neverthrow";
import {WarrantyForm} from "../entity/warrantyForm";
import {WarrantyFilter} from "../entity/filter";
import {Paging} from "../../../libs/paging";

export interface IWarrantyService {
    create(requester: IRequester, create : WarrantyFormCreate): ResultAsync<void,Error>
    findById(id : number): ResultAsync<WarrantyForm, Error>
    findMany(filter: WarrantyFilter, paging :Paging) : ResultAsync<WarrantyForm[], Error>
    update(requester: IRequester,id: number, update: WarrantyFormCreate): ResultAsync<void, Error>
}