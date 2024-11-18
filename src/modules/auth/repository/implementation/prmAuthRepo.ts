import {IAuthRepository} from "../IAuthRepository";
import {prisma} from "../../../../components/prisma";
import {ResultAsync} from "neverthrow";
import {createDatabaseError, Err} from "../../../../libs/errors";
import {AuthCreate} from "../../entity/authCreate";
import {injectable} from "inversify";


@injectable()
export class PrmAuthRepo implements IAuthRepository {
    Begin(): ResultAsync<void, Err> {
        throw new Error("Method not implemented.");
    }
    Commit(): ResultAsync<void, Err> {
        throw new Error("Method not implemented.");
    }
    Rollback(): ResultAsync<void, Err> {
        throw new Error("Method not implemented.");
    }

    Create = (u: AuthCreate): ResultAsync<void, Err> => {
        const {firstName, lastName, systemRole, ...authData} = u;
        return ResultAsync.fromPromise(
            prisma.auth.create({data: authData}).then(
                r => { u.id = r.id }
            ),
            (r) => createDatabaseError(r)
        )
    }

    FindByUserName = (userName: string) => {
        return ResultAsync.fromPromise(
            prisma.auth.findFirst(
                {where: {userName: userName}},
            ).then(r => r),
            r => createDatabaseError(r)
        )
    };

    FindByUserId = (id: number) => {
        return ResultAsync.fromPromise(
            prisma.auth.findFirst({
                    where: {
                        userId: id
                    }
                }
            ).then(r => r),
            r => createDatabaseError(r)
        )
    }
}