import {IBaseRepo} from "../../../../libs/IBaseRepo";
import {categoryCreate} from "../entity/categoryCreate";
import {ResultAsync} from "neverthrow";
import {Err} from "../../../../libs/errors";
import {categoryUpdate} from "../entity/categoryUpdate";
import {ICondition} from "../../../../libs/condition";
import {Paging} from "../../../../libs/paging";
import {Category} from "@prisma/client";
import {IRequester} from "../../../../libs/IRequester";

export interface ICategoryService  {
    create(requester : IRequester,c : categoryCreate): ResultAsync<void, Err>
    update(requester : IRequester,id : number,c : categoryUpdate): ResultAsync<void, Err>
    delete(requester : IRequester,id : number): ResultAsync<void, Err>
    list(cond : ICondition, paging : Paging): ResultAsync<Category[] | null , Err>
    findById(id : number): ResultAsync<Category | null, Err>
}