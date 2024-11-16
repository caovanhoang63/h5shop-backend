import {UserCreate} from "../entity/userVar";
import {ResultAsync} from "neverthrow";
import {Err} from "../../../libs/errors";
import {ICondition} from "../../../libs/condition";
import {Paging} from "../../../libs/paging";
import {User} from "../entity/user";

export interface IUserRepository {
    Create: (u: UserCreate) => ResultAsync<void, Err>
    FindByCondition: (condition: ICondition, paging: Paging) => ResultAsync<User[], Err>
    FindByUserId: (id: number) => ResultAsync<User | null, Err>
}