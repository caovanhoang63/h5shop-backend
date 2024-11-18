import {UserCreate} from "../entity/userCreate";
import {ResultAsync} from "neverthrow";
import {Err} from "../../../libs/errors";
import {ICondition} from "../../../libs/condition";
import {Paging} from "../../../libs/paging";
import {User} from "../entity/user";
import {IBaseRepo} from "../../../libs/IBaseRepo";

export interface IUserRepository {
    create: (u: UserCreate) => ResultAsync<void, Err>
    findByCondition: (condition: ICondition, paging: Paging) => ResultAsync<User[], Err>
    findByUserId: (id: number) => ResultAsync<User | null, Err>
}