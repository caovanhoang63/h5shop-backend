import {AuthCreate, AuthDdCreate} from "../entity/authVar";
import {Auth} from "../entity/auth";
import {Nullable} from "../../../libs/nullable";
import {AppError} from "../../../libs/errors";
import {ResultAsync} from "neverthrow";

export interface IAuthRepository {
    Create: (u: AuthCreate) => ResultAsync<void,AppError>
    FindByUserName: (userName: string) => ResultAsync<Nullable<Auth>,AppError>
    FindByUserId: (id: number) => ResultAsync<Nullable<Auth>,AppError>
}