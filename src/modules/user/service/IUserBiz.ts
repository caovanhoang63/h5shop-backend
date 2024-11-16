import {UserCreate} from "../entity/userCreate";
import {ResultAsync} from "neverthrow";
import {Err} from "../../../libs/errors";
import {ICondition} from "../../../libs/condition";
import {Paging} from "../../../libs/paging";
import {User} from "../entity/user";

export interface IUserBiz {
    createNewUser: (u: UserCreate) => ResultAsync<any, Err>
    listUsers: (cond: ICondition, paging: Paging) => ResultAsync<User[], Err>
}