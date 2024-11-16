import {UserCreate, userCreateSchema} from "../entity/userCreate";
import {createEntityNotFoundError, createForbiddenError, Err,} from "../../../libs/errors";
import {Paging} from "../../../libs/paging";
import {SystemRole} from "../entity/user";
import {Validator} from "../../../libs/validator";
import {Requester} from "../../../libs/requester";
import {errAsync, ok, ResultAsync} from "neverthrow";
import {IUserRepository} from "../repository/IUserRepository";
import {IUserBiz} from "./IUserBiz";
import {UserSystemRole} from "@prisma/client";
import {ICondition} from "../../../libs/condition";


export class UserService  implements  IUserBiz{
    constructor(private readonly userRepository: IUserRepository) {
    }

    public createNewUser = (u: UserCreate): ResultAsync<void, Err> => {
        return ResultAsync.fromPromise(
            (async () => {
                const vR = (await Validator(userCreateSchema, u))
                if (vR.isErr()) {
                    return vR
                }

                const r = await this.userRepository.create(u);
                if (r.isErr()) {
                    return r
                }
                return ok(undefined);
            })(), e => e as Err
        ).andThen(r => r);
    }

    public requiredRole = (r: Requester, ...roles: UserSystemRole[]) => {
        return ResultAsync.fromPromise(
            (async () => {
                const uR = await this.userRepository.findByUserId(r.userId);
                if (uR.isErr()) {
                    return uR
                }

                if (!uR.value) {
                    return errAsync(createEntityNotFoundError("user"))
                }
                const data = uR.value

                if (data.systemRole === SystemRole.Admin) {
                    return;
                }

                if (roles.length > 0 && !roles.includes(data.systemRole!)) {
                    return errAsync(createForbiddenError())
                }
                return;
            })(), e => e as Err
        )
    }

    public listUsers = (cond: ICondition, paging: Paging) => {

        return this.userRepository.findByCondition(cond, paging)

    }
}



