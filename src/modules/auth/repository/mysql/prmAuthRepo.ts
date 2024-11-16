import {AuthCreate} from "../../entity/authVar";
import {IAuthRepository} from "../IAuthRepository";
import {prisma} from "../../../../components/prisma";
import {ResultAsync} from "neverthrow";
import {createDatabaseError, Err} from "../../../../libs/errors";

export class PrmAuthRepo implements IAuthRepository {
    Create = (u: AuthCreate): ResultAsync<void, Err> => {
        const {firstName, lastName, systemRole, ...authData} = u;
        return ResultAsync.fromPromise(
            prisma.auth.create({data: authData}).then(
                r => {
                }
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
                        id: id
                    }
                }
            ).then(r => r),
            r => createDatabaseError(r)
        )
    }

}