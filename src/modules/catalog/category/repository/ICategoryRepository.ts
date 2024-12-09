import {IBaseRepo} from "../../../../libs/IBaseRepo";
import {CategoryCreate} from "../entity/categoryCreate";
import {ResultAsync} from "neverthrow";
import {Err} from "../../../../libs/errors";
import {ICondition} from "../../../../libs/condition";
import {Paging} from "../../../../libs/paging";
import {CategoryUpdate} from "../entity/categoryUpdate";
import {Category} from "../entity/category";


export interface ICategoryRepository extends IBaseRepo {
    create(c : CategoryCreate): ResultAsync<void, Err>
    update(id : number,c : CategoryUpdate): ResultAsync<void, Err>
    delete(id : number): ResultAsync<void, Err>
    list(cond : ICondition, paging : Paging): ResultAsync<Category[] | null , Err>
    findById(id : number): ResultAsync<Category | null, Err>
}