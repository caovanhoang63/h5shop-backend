import {IBaseRepo} from "../../../../libs/IBaseRepo";
import {Err} from "../../../../libs/errors";
import {BrandCreate} from "../entity/brandCreate";
import {ResultAsync} from "neverthrow";
import {ICondition} from "../../../../libs/condition";
import {Paging} from "../../../../libs/paging";

export interface IBrandRepository extends IBaseRepo {
    create(c : BrandCreate): ResultAsync<void, Err>
    update(id : number,c : BrandCreate): ResultAsync<void, Err>
    delete(id : number): ResultAsync<void, Err>
    list(cond : ICondition, paging : Paging): ResultAsync<BrandCreate[] | null, Err>
    findById(id : number): ResultAsync<BrandCreate | null, Err>
}