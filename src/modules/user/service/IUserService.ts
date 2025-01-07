import {UserCreate} from "../entity/userCreate";
import {ResultAsync} from "neverthrow";
import {Err} from "../../../libs/errors";
import {ICondition} from "../../../libs/condition";
import {Paging} from "../../../libs/paging";
import {SystemRole, User} from "../entity/user";
import {IRequester} from "../../../libs/IRequester";
import {EmployeeUpdate} from "../../employee/entity/employee";
import {UserUpdate} from "../entity/userUpdate";

export interface IUserService {
    createNewUser(u: UserCreate): ResultAsync<any, Err>
    listUsers(cond: ICondition, paging: Paging): ResultAsync<User[], Err>
    requiredRole(r: IRequester, ...roles: SystemRole[]): ResultAsync<void, Err>
    hardDeleteById(id: number): ResultAsync<void, Err>
    getProfile(requester : IRequester): ResultAsync<User | null, Err>
    update(requester: IRequester, id: number, c: UserUpdate): ResultAsync<void, Err>
}