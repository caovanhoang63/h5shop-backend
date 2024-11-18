import {IBaseRepo} from "../../../../libs/IBaseRepo";
import {categoryCreate} from "../entity/categoryCreate";
import {ResultAsync} from "neverthrow";
import {Err} from "../../../../libs/errors";
import {ICondition} from "../../../../libs/condition";
import {Paging} from "../../../../libs/paging";
import {categoryUpdate} from "../entity/categoryUpdate";
import {Category} from "@prisma/client";


export interface ICategoryRepository extends IBaseRepo {
    create(c : categoryCreate): ResultAsync<void, Err>
    update(id : number,c : categoryUpdate): ResultAsync<void, Err>
    delete(id : number): ResultAsync<void, Err>
    list(cond : ICondition, paging : Paging): ResultAsync<Category[] | null , Err>
    findById(id : number): ResultAsync<Category | null, Err>
}