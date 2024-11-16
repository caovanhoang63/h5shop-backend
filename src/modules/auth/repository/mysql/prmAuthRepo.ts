import { ResultAsync } from "../../../../libs/resultAsync";
import { Auth } from "../../entity/auth";
import {AuthCreate, AuthDdCreate} from "../../entity/authVar";
import {IAuthRepository} from "../IAuthRepository";
import {prisma} from "../../../../components/prisma";
import {Err, Ok} from "../../../../libs/result";
import {Nullable} from "../../../../libs/nullable";

export class PrmAuthRepo implements IAuthRepository {
    Create =  (u: AuthCreate) : ResultAsync<void> => {
        const { firstName,lastName,systemRole, ...authData } = u;
        return ResultAsync.fromPromise(
            prisma.auth.create({data: authData}).then(
                r => Ok<void>()
            ).catch(
                e => Err<void>(e)
            )
        )
    }


    FindByUserName=  (userName: string)  => {
        return ResultAsync.fromPromise(
            prisma.auth.findFirst(
                {
                    where: {
                        userName: userName
                    }
                }
            ).then( r => {
                return Ok<Nullable<Auth>>(r)
            }).catch(
                r => Err<Nullable<Auth>>(r)
            )
        )
    };

    FindByUserId =  (id: number) : ResultAsync<Auth | null> => {
        return ResultAsync.fromPromise(
            prisma.auth.findFirst(
            {
                where: {
                    id: id,
                }
            }
        ).then( r => {
            return Ok<Nullable<Auth>>(r)
        }).catch(
            r => Err<Nullable<Auth>>(r)
        ))
    }


}