import {AuthCreate} from "../../entity/authVar";
import {IAuthRepository} from "../IAuthRepository";
import {prisma} from "../../../../components/prisma";
import {ResultAsync} from "neverthrow";
import {AppError, newDBError} from "../../../../libs/errors";

export class PrmAuthRepo implements IAuthRepository {
    Create =  (u: AuthCreate) : ResultAsync<void,AppError> => {
        const { firstName,lastName,systemRole, ...authData } = u;
        return  ResultAsync.fromPromise(
            prisma.auth.create({data: authData}).then(
                r => {}
            ),
            (r) => newDBError(r)
        )
    }

    FindByUserName=  (userName: string)  => {
        return ResultAsync.fromPromise(
            prisma.auth.findFirst(
                {where: {userName : userName}},
            ).then( r => r ),
            r => newDBError(r)
        )
    };

    FindByUserId =  (id: number)=> {
        return ResultAsync.fromPromise(
            prisma.auth.findFirst({
                where: {
                       id: id
                    }
                }
            ).then( r => r ),
            r => newDBError(r)
        )
    }

}