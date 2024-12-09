import {TokenResponse} from "../../entity/authVar";
import {createForbiddenError, Err} from "../../../../libs/errors";
import {ErrInvalidCredentials, ErrUserNameAlreadyExists} from "../../entity/authErrors";
import {randomSalt} from "../../../../libs/salt";
import {Validator} from "../../../../libs/validator";
import {IRequester} from "../../../../libs/IRequester";
import {
    defaultExpireAccessTokenInSeconds,
    defaultExpireRefreshTokenInSeconds,
    IJwtProvider,
    JwtClaim
} from "../../../../components/jwtProvider/IJwtProvider";
import {randomUUID} from "node:crypto";
import {IAuthRepository} from "../../repository/IAuthRepository";
import {errAsync, okAsync, ResultAsync} from "neverthrow";
import {IAuthService} from "../interface/IAuthService";
import {AuthCreate, authCreateSchema} from "../../entity/authCreate";
import {AuthLogin, authLoginSchema} from "../../entity/authLogin";
import {TYPES} from "../../../../types";
import {inject, injectable} from "inversify";
import {createMessage, IPubSub} from "../../../../components/pubsub";
import {topicDeleteUser, topicRegister} from "../../../../libs/topics";
import {UserCreate} from "../../../user/entity/userCreate";
import {IUserRepository} from "../../../user/repository/IUserRepository";


export interface IHasher {
    hash: (value: string, salt: string) => string
}

@injectable()
export class AuthService implements IAuthService {
    constructor(@inject(TYPES.IAuthRepository) private readonly authRepo: IAuthRepository,
                @inject(TYPES.IHasher) private readonly hasher: IHasher,
                @inject(TYPES.IUserRepository) private readonly userRepo: IUserRepository,
                @inject(TYPES.IJwtProvider) private readonly jwtProvider: IJwtProvider,
                @inject(TYPES.IPubSub) private readonly pubSub: IPubSub,) {
    }

    public register = (requester: IRequester, u: AuthCreate): ResultAsync<void, Err> => {
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

                const create: UserCreate = {
                    firstName: u.firstName,
                    lastName: u.lastName,
                    systemRole: u.systemRole,
                    userName: u.userName
                }
                // Create new user
                const createUserR = await this.userRepo.create(create);

                if (createUserR.isErr()) {
                    return errAsync(createUserR.error);
                }

                // Prepare user data for auth
                u.userId = create.id!;
                u.salt = randomSalt(50);

                u.password = this.hasher.hash(u.password, u.salt);

                // Create auth entry
                const r = await this.authRepo.Create(u);

                if (r.isErr()) {
                    this.pubSub.Publish(topicDeleteUser, createMessage({id: create.id}));
                    return errAsync(r.error);
                }

                this.pubSub.Publish(topicRegister, createMessage(u, requester));

                return okAsync(undefined); // Success case
            })(),
            (e) => e as Err // Catch any unexpected errors
        ).andThen((result) => result); // Unwrap the ResultAsync for compatibility
    };

    public introspectToken = (token: string): ResultAsync<IRequester, Err> => {
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


                if (uR.value == null) {
                    return errAsync(createForbiddenError());
                }

                // Build the requester object
                const requester: IRequester = {
                    requestId: claim.id,
                    userId: userId,
                    systemRole: null
                };

                return okAsync(requester);
            })(),
            (e) => e as Err // Handle unexpected errors
        ).andThen((result) => result); // Ensure correct result wrapping
    };

    public login = (requester: IRequester, u: AuthLogin): ResultAsync<TokenResponse, Err> => {
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