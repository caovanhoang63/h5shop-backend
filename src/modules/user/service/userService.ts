import {UserCreate, userCreateSchema} from "../entity/userCreate";
import {createEntityNotFoundError, createForbiddenError, createInternalError, Err,} from "../../../libs/errors";
import {Paging} from "../../../libs/paging";
import {SystemRole, User} from "../entity/user";
import {Validator} from "../../../libs/validator";
import {IRequester} from "../../../libs/IRequester";
import {err, ok, ResultAsync} from "neverthrow";
import {IUserRepository} from "../repository/IUserRepository";
import {IUserService} from "./IUserService";
import {ICondition} from "../../../libs/condition";
import {inject, injectable} from "inversify";
import {TYPES} from "../../../types";
import {UserUpdate, userUpdateSchema} from "../entity/userUpdate";

@injectable()
export class UserService implements IUserService {
    constructor(@inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository) {
    }

    update(requester: IRequester, id: number, c: UserUpdate): ResultAsync<void, Err> {
        return ResultAsync.fromPromise((async () => {
            const vR = await Validator(userUpdateSchema,c)
            if (vR.isErr()) {
                return err(vR.error);
            }

            const old = await this.userRepository.findByUserId(id)
            if (old.isErr()) {
                return err(old.error)
            }

            if (old.value == null) {
                return err(createEntityNotFoundError("user"));
            }

            const r = await this.userRepository.update(id,c)
            if (r.isErr()) {
                return err(createInternalError(r.error))
            }

            return ok(undefined)
        })(),e=>createInternalError(e)
        ).andThen(r=>r)
    }


    public createNewUser = (u: UserCreate): ResultAsync<void, Err> => {
        return ResultAsync.fromPromise(
            (async () => {
                const vR = (await Validator(userCreateSchema, u))
                if (vR.isErr()) {
                    return err(vR.error);
                }

                const r = await this.userRepository.create(u);
                if (r.isErr()) {
                    return err(r.error);
                }
                return ok(undefined);
            })(), e => e as Err
        ).andThen(r => r)
    }

    public requiredRole = (r: IRequester, ...roles: SystemRole[]): ResultAsync<void, Err> => {
        return ResultAsync.fromPromise(
            (async () => {
                const uR = await this.userRepository.findByUserId(r.userId!);
                if (uR.isErr()) {
                    return err(uR.error)
                }

                if (!uR.value) {
                    return err(createEntityNotFoundError("user"))
                }
                const data = uR.value

                r.systemRole = data.systemRole

                if (data.systemRole === SystemRole.Admin) {
                    return ok(undefined);

                }

                if (roles.length > 0 && !roles.includes(data.systemRole!)) {
                    return err(createForbiddenError())
                }
                return ok(undefined);
            })(), e => e as Err
        ).andThen(r => r)
    }
    getProfile(requester: IRequester): ResultAsync<User | null, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                if (!requester || !requester.userId) {
                    return err(createForbiddenError())
                }

                const r = await  this.userRepository.findByUserId(requester.userId)
                if (r.isErr()) {
                    return err(createEntityNotFoundError("user"))
                }
                return ok(r.value)
            })(),
            e => createInternalError(e)
        ).andThen(r=>r)

    }

    hardDeleteById(id: number): ResultAsync<void, Err> {
        return this.userRepository.hardDeleteById(id)
    }

    listUsers = (cond: ICondition, paging: Paging) => {
        return this.userRepository.findByCondition(cond, paging)
    }
}



