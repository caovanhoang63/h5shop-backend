import {UserCreate} from "../entity/userCreate";
import {ResultAsync} from "neverthrow";
import {Err} from "../../../libs/errors";
import {ICondition} from "../../../libs/condition";
import {Paging} from "../../../libs/paging";
import {User} from "../entity/user";
import {IRequester} from "../../../libs/IRequester";
import {UserSystemRole} from "@prisma/client";

export interface IUserService {
    createNewUser(u: UserCreate): ResultAsync<any, Err>

    listUsers(cond: ICondition, paging: Paging): ResultAsync<User[], Err>

    requiredRole(r: IRequester, ...roles: UserSystemRole[]): ResultAsync<void, Err>

    hardDeleteById(id: number): ResultAsync<void, Err>
}