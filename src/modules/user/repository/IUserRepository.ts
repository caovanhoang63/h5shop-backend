import {UserCreate} from "../entity/userVar";
import {ResultAsync} from "neverthrow";
import {AppError} from "../../../libs/errors";
import {ICondition} from "../../../libs/condition";
import {Paging} from "../../../libs/paging";
import {User} from "../entity/user";

export interface IUserRepository {
    Create: (u: UserCreate) => ResultAsync<void, AppError>
    FindByCondition: (condition: ICondition, paging: Paging) => ResultAsync<User[], AppError>
    FindByUserId: (id: number) => ResultAsync<User | null, AppError>
}