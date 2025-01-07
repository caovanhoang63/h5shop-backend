import {WarrantyFormCreate} from "../entity/warrantyFormCreate";
import {ResultAsync} from "neverthrow";
import {WarrantyForm} from "../entity/warrantyForm";
import {WarrantyFilter} from "../entity/filter";
import {Paging} from "../../../libs/paging";


export interface IWarrantyRepo {
    create(create : WarrantyFormCreate): ResultAsync<void,Error>
    findById(id : number): ResultAsync<WarrantyForm | null, Error>
    findMany(filter: WarrantyFilter, paging :Paging) : ResultAsync<WarrantyForm[], Error>
    update(id: number, update: WarrantyFormCreate): ResultAsync<void, Error>
}