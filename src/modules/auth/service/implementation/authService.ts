import {AuthCreate, AuthLogin, TokenResponse} from "../../entity/authVar";
import {Err} from "../../../../libs/errors";
import {ErrInvalidCredentials, ErrUserNameAlreadyExists} from "../../entity/error";
import {randomSalt} from "../../../../libs/salt";
import {SystemRole} from "../../../user/entity/user";
import {Nullable} from "../../../../libs/nullable";
import {authCreateSchema, authLoginSchema} from "../../entity/validate";
import {Validator} from "../../../../libs/validator";
import {Requester} from "../../../../libs/requester";
import {
    defaultExpireAccessTokenInSeconds,
    defaultExpireRefreshTokenInSeconds,
    JwtClaim,
    JwtProvider
} from "../../../../components/jwtProvider/jwtProvider";
import {randomUUID} from "node:crypto";
import {IAuthRepository} from "../../repository/IAuthRepository";
import {errAsync, okAsync, ResultAsync} from "neverthrow";
import {IAuthService} from "../interface/IAuthService";


export interface IUserRepository {
    CreateNewUser(firstName: string, lastName: string, userName: string, systemRole: SystemRole): Promise<[number, Nullable<Err>]>
}

export interface IHasher {
    hash: (value: string, salt: string) => string
}

export class AuthService implements IAuthService {
    constructor(private readonly authRepo: IAuthRepository,
                private readonly hasher: IHasher,
                private readonly userRepo: IUserRepository,
                private readonly jwtProvider: JwtProvider) {
    }

    public Register = (u: AuthCreate): ResultAsync<void, Err> => {
        return ResultAsync.fromPromise(
            (async () => {
                // Validate
                const vR = await Validator(authCreateSchema, u);
                if (vR.isErr()) {
                    return errAsync(vR.error);
                }

                // Check if username exists
                const old = await this.authRepo.FindByUserName(u.userName);
                if (old.isErr()) {
                    return errAsync(old.error);
                }
                if (old.value) {
                    return errAsync(ErrUserNameAlreadyExists(u.userName));
                }

                // Create new user
                const [user, err] = await this.userRepo.CreateNewUser(
                    u.firstName,
                    u.lastName,
                    u.userName,
                    u.systemRole
                );
                if (err) {
                    return errAsync(err);
                }

                // Prepare user data for auth
                u.userId = user;
                u.salt = randomSalt(50);
                u.password = this.hasher.hash(u.password, u.salt);

                // Create auth entry
                const r = await this.authRepo.Create(u);
                if (r.isErr()) {
                    return errAsync(r.error);
                }

                return okAsync(undefined); // Success case
            })(),
            (e) => e as Err // Catch any unexpected errors
        ).andThen((result) => result); // Unwrap the ResultAsync for compatibility
    };

    public IntrospectToken = (token: string): ResultAsync<Requester, Err> => {
        return ResultAsync.fromPromise(
            (async () => {
                // Parse the token
                const rP = this.jwtProvider.ParseToken(token);
                if (rP.isErr()) {
                    return errAsync(rP.error);
                }
                const claim = rP.value as JwtClaim;

                // Extract userId and find user
                const userId = parseInt(claim.sub);
                const uR = await this.authRepo.FindByUserId(userId);
                if (uR.isErr()) {
                    return errAsync(uR.error);
                }

                // Build the requester object
                const requester: Requester = {
                    requestId: claim.id,
                    userId: userId,
                };

                return okAsync(requester);
            })(),
            (e) => e as Err // Handle unexpected errors
        ).andThen((result) => result); // Ensure correct result wrapping
    };

    public Login = (u: AuthLogin): ResultAsync<TokenResponse, Err> => {
        return ResultAsync.fromPromise(
            (async () => {
                // Validate input
                const vR = await Validator(authLoginSchema, u);
                if (vR.isErr()) {
                    return errAsync(vR.error);
                }

                // Find user by username
                const uR = await this.authRepo.FindByUserName(u.userName);
                if (uR.isErr()) {
                    return errAsync(uR.error);
                }

                // Check credentials
                if (uR.value === null || uR.value.password !== this.hasher.hash(u.password, uR.value.salt)) {
                    return errAsync(ErrInvalidCredentials());
                }

                // Generate access and refresh tokens
                const [accessToken, accessExp] = this.jwtProvider.IssueToken(
                    randomUUID(),
                    uR.value.userId.toString(),
                    defaultExpireAccessTokenInSeconds
                );

                const [refreshToken, refreshRxp] = this.jwtProvider.IssueToken(
                    randomUUID(),
                    uR.value.userId.toString(),
                    defaultExpireRefreshTokenInSeconds
                );

                return okAsync({
                    accessToken: {
                        token: accessToken,
                        expiredIn: accessExp,
                    },
                    refreshToken: {
                        token: refreshToken,
                        expiredIn: refreshRxp,
                    },
                });
            })(),
            (e) => e as Err // Handle unexpected errors
        ).andThen((result) => result); // Ensure correct result wrapping
    };

}