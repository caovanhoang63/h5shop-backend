import {AuthCreate, AuthLogin, TokenResponse} from "../../entity/authVar";
import {ResultAsync} from "neverthrow";
import {AppError} from "../../../../libs/errors";

export interface IAuthService {
    Register: (u: AuthCreate) => ResultAsync<void, AppError>
    Login: (u: AuthLogin) => ResultAsync<TokenResponse, AppError>
}
