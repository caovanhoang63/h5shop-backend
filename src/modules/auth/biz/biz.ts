import {AuthCreate} from "../entity/authVar";
import {Result} from "../../../libs/result";
import {Auth} from "../entity/auth";
import {errAsync, okAsync, ResultAsync} from "../../../libs/resultAsync";
import {AppError, ErrDbKey, InternalError} from "../../../libs/errors";
import {ErrUserNameAlreadyExists} from "../entity/error";
import {randomSalt} from "../../../libs/salt";
import {SystemRole, User} from "../../user/entity/user";
import {Nullable} from "../../../libs/nullable";

interface IAuthRepository {
    Create: (u : AuthCreate) => ResultAsync<void>
    FindByUserName: (userName: string ) => ResultAsync<Auth>
}

interface IUserRepository {
    CreateNewUser(firstName: string, lastName: string, userName: string , systemRole: SystemRole ) : Promise<[number, Nullable<AppError> ]>
}

export interface IHasher {
    hash: (value : string, salt :string ) => string
}

export class AuthBiz {
    constructor(private readonly authRepo: IAuthRepository, private readonly hasher : IHasher, private readonly userRepo : IUserRepository) {

    }

    // @ts-ignore
    public Register= async  (u : AuthCreate) : ResultAsync<void> =>  {
        const old = await this.authRepo.FindByUserName(u.userName)
        if (old.isErr() && old.errIs(ErrDbKey)) {
            return errAsync<void>(old.wrapBy(InternalError).error!)
        }

        if (old.data) {
            return errAsync<void>(ErrUserNameAlreadyExists(u.userName))
        }

        const [user, err]  = await this.userRepo.CreateNewUser(u.firstName,u.lastName,u.userName,u.systemRole)

        if (err != null ) {
            return errAsync<void>(err)
        }

        u.userId = user
        u.salt = randomSalt(50)
        u.password = this.hasher.hash(u.password,u.salt)


        const r = await this.authRepo.Create(u)

        if (r.isErr() && r.errIs(ErrDbKey)) {
            return errAsync<void>(old.wrapBy(InternalError).error!)
        }

        return okAsync<void>(undefined)
    }
}