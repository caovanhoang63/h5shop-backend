import {CategoryCreate} from "../entity/categoryCreate";
import {ResultAsync} from "neverthrow";
import {Err} from "../../../../libs/errors";
import {CategoryUpdate} from "../entity/categoryUpdate";
import {ICondition} from "../../../../libs/condition";
import {Paging} from "../../../../libs/paging";
import {IRequester} from "../../../../libs/IRequester";
import {Category} from "../entity/category";
import {CategoryNode} from "../entity/categoryNode";

export interface ICategoryService  {
    create(requester : IRequester,c : CategoryCreate): ResultAsync<void, Err>
    update(requester : IRequester,id : number,c : CategoryUpdate): ResultAsync<void, Err>
    delete(requester : IRequester,id : number): ResultAsync<void, Err>
    list(cond : ICondition, paging : Paging): ResultAsync<Category[] | null , Err>
    listTree(cond : ICondition, paging : Paging): ResultAsync<CategoryNode[] | null, Err>
    findById(id : number): ResultAsync<Category | null, Err>
}