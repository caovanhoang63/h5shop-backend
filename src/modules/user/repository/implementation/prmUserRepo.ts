import {ResultAsync} from "neverthrow";
import {ICondition} from "../../../../libs/condition";
import {createDatabaseError, Err} from "../../../../libs/errors";
import {Paging} from "../../../../libs/paging";
import {User} from "../../entity/user";
import {UserCreate} from "../../entity/userCreate";
import {IUserRepository} from "../IUserRepository";
import {prisma} from "../../../../components/prisma";
import {take} from "lodash";
import {injectable} from "inversify";


@injectable()
export class PrmUserRepo implements IUserRepository {
    create = (u: UserCreate): ResultAsync<void, Err> => {
        return ResultAsync.fromPromise(
            prisma.user.create({data: u}).then(result => {
                u.id = result.id
            }),
            e => createDatabaseError(e)
        )
    }

    findByCondition(condition: ICondition, paging: Paging): ResultAsync<User[], Err> {
        return ResultAsync.fromPromise(
            prisma.user.count({where: condition}),
            e => createDatabaseError(e)
        ).andThen(
            r => {
                paging.total = r;
                return  ResultAsync.fromPromise(
                    prisma.user.findMany({
                        where: condition,
                        cursor: paging.cursor ? {id: paging.cursor} : undefined,
                        take: paging.limit,
                        skip: paging.cursor ? undefined : (paging.page - 1) * paging.limit
                    }).then(r => r),
                    e => createDatabaseError(e)
                )
            }
        )
    }

    findByUserId(id: number): ResultAsync<User | null, Err> {
        return ResultAsync.fromPromise(
            prisma.user.findUnique({
                where: {id: id},
            }),
            e => createDatabaseError(e)
        )

    }
}