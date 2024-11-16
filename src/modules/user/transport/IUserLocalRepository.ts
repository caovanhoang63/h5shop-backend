import {SystemRole} from "../entity/user";
import {Nullable} from "../../../libs/nullable";
import {Err} from "../../../libs/errors";

export interface IUserLocalRepository {
    CreateNewUser(firstName: string, lastName: string, userName: string, systemRole: SystemRole): Promise<[number, Nullable<Err>]>
}