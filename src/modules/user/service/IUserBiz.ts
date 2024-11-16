import {UserCreate} from "../entity/userVar";
import {ResultAsync} from "neverthrow";
import {AppError} from "../../../libs/errors";
import {ICondition} from "../../../libs/condition";
import {Paging} from "../../../libs/paging";
import {User} from "../entity/user";

export interface IUserBiz {
    createNewUser: (u: UserCreate) => ResultAsync<any, AppError>
    listUsers: (cond: ICondition, paging: Paging) => ResultAsync<User[], AppError>
}