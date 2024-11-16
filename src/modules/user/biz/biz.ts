import {UserCreate, userCreateSchema} from "../entity/userVar";
import {AppError, newEntityNotFound, newForbidden} from "../../../libs/errors";
import {ICondition} from "../../../libs/condition";
import {Paging} from "../../../libs/paging";
import {SystemRole, User} from "../entity/user";
import {Validator} from "../../../libs/validator";
import {Requester} from "../../../libs/requester";
import {errAsync, ok, ResultAsync} from "neverthrow";

interface IUserRepository {
    Create: (u: UserCreate) => ResultAsync<void,AppError>
    FindByCondition: (condition: ICondition, paging: Paging) => ResultAsync<User[],AppError>
    FindByUserId: (id: number) => ResultAsync<User | null,AppError>
}

export class UserBiz {
    constructor(private readonly userRepository: IUserRepository) {
    }

    public CreateNewUser = (u: UserCreate) : ResultAsync<void, AppError> => {
        return ResultAsync.fromPromise(
            (async () => {
                const vR = (await Validator(userCreateSchema, u))
                if (vR.isErr()) {
                    return vR
                }

                const r = await this.userRepository.Create(u);
                if (r.isErr()) {
                    return r
                }
                return ok(undefined);
            })(), e => e as AppError
        ).andThen(r => r);
    }

    public RequiredRole = (r: Requester, ...roles: SystemRole[]) => {
        return ResultAsync.fromPromise(
            (async () => {
                const uR = await this.userRepository.FindByUserId(r.userId);
                if (uR.isErr()) {
                    return uR
                }

                if (!uR.value) {
                    return errAsync(newEntityNotFound("user"))
                }
                const data = uR.value

                if (data.systemRole === SystemRole.Admin) {
                    return;
                }

                if (roles.length > 0 && !roles.includes(data.systemRole)) {
                    return errAsync(newForbidden())
                }
                return;
            })(), e => e as AppError
        )
    }

    public ListUsers = () => {
        const cond = {}

        const paging: Paging = {
            cursor: 0, limit: 0, nextCursor: 0, page: 0, total: 0

        }

        return this.userRepository.FindByCondition(cond, paging)

    }
}



