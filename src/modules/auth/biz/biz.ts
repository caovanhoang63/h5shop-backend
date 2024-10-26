import {AuthCreate} from "../entity/authVar";
import {Err, Ok, Result} from "../../../libs/result";
import {Auth} from "../entity/auth";
import {errAsync, okAsync, ResultAsync} from "../../../libs/resultAsync";
import {AppError, ErrKeyDb, newInternalError} from "../../../libs/errors";
import {ErrUserNameAlreadyExists} from "../entity/error";
import {randomSalt} from "../../../libs/salt";
import {SystemRole, User} from "../../user/entity/user";
import {Nullable} from "../../../libs/nullable";
import {authCreateSchema} from "../entity/validate";
import {Validator} from "../../../libs/validator";
import {Requester} from "../../../libs/requester";
import {JwtClaim, JwtProvider, jwtProvider} from "../../../components/jwtProvider/jwtProvider";

interface IAuthRepository {
    Create: (u : AuthCreate) => ResultAsync<void>
    FindByUserName: (userName: string ) => ResultAsync<Auth>
    FindByUserId: (id: number) => ResultAsync<Auth>
}

interface IUserRepository {
    CreateNewUser(firstName: string, lastName: string, userName: string , systemRole: SystemRole ) : Promise<[number, Nullable<AppError> ]>
}

export interface IHasher {
    hash: (value : string, salt :string ) => string
}


export class AuthBiz {
    constructor(private readonly authRepo: IAuthRepository,
                private readonly hasher : IHasher,
                private readonly userRepo : IUserRepository,
                private readonly jwtProvider: JwtProvider) {}

    public IntrospectToken = (token: string) : ResultAsync<Requester> => {
        return ResultAsync.fromPromise(
            (async () => {
                const rP = this.jwtProvider.ParseToken(token);
                if (rP.isErr()) {
                    return Err<Requester>(null)
                }
                const claim = rP.data as JwtClaim

                const userId = parseInt(claim.sub,64)
                const uR =  await this.authRepo.FindByUserId(userId)
                if (uR.isErr()) {
                    return Err<Requester>(uR.error)
                }

                const requester : Requester = {
                    requestId: claim.id,
                    userId: userId
                }

                return Ok(requester)

            })()
        )
    }

    public Register=  (u : AuthCreate) : ResultAsync<void>=>  {
        return ResultAsync.fromPromise(
            (async () => {
                // validate
                const vR = (await Validator(authCreateSchema,u))
                console.log(u)
                if (vR.isErr()) {
                    return vR
                }

                const old = await this.authRepo.FindByUserName(u.userName)
                if (old.isErr()) {
                    return Err<void>(old.error)
                }

                if (old.data) {
                    return Err<void>(ErrUserNameAlreadyExists(u.userName))
                }

                const [user, err]  = await this.userRepo.CreateNewUser(u.firstName,u.lastName,u.userName,u.systemRole)

                if (err != null ) {
                    return Err<void>(err)
                }

                u.userId = user
                u.salt = randomSalt(50)
                u.password = this.hasher.hash(u.password,u.salt)

                const r = await this.authRepo.Create(u)

                if (r.isErr() ) {
                    return r
                }

                return Ok<void>(undefined)
            })()
        )
    }
}