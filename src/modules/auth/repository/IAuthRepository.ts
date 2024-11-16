import {AuthCreate, AuthDdCreate} from "../entity/authVar";
import {ResultAsync} from "../../../libs/resultAsync";
import {Auth} from "../entity/auth";
import {Nullable} from "../../../libs/nullable";

export interface IAuthRepository {
    Create: (u: AuthCreate) => ResultAsync<void>
    FindByUserName: (userName: string) => ResultAsync<Nullable<Auth>>
    FindByUserId: (id: number) => ResultAsync<Nullable<Auth>>
}