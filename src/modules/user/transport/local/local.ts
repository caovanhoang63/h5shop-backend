import {UserCreate} from "../../entity/userVar";
import {ResultAsync} from "../../../../libs/resultAsync";
import {IAppContext} from "../../../../components/appContext/appContext";
import {UserBiz} from "../../biz/biz";
import express from "express";
import {SystemRole} from "../../entity/user";
import {AppResponse} from "../../../../libs/response";
import {AppError} from "../../../../libs/errors";
import {Nullable} from "../../../../libs/nullable";
import {UserMysqlRepo} from "../../repository/mysql/mysqlRepo";

interface IUserBiz {
    CreateNewUser: (u: UserCreate) => ResultAsync<void>
}

export class UserLocal {
    private readonly userBiz  : IUserBiz;
    constructor(private readonly appContext : IAppContext) {
        this.userBiz = new UserBiz(new UserMysqlRepo(appContext.GetDbConnectionPool()));
    }

    public CreateNewUser =  async (firstName: string, lastName: string, userName: string , systemRole: SystemRole ) : Promise<[number, Nullable<AppError>]>  => {
        const data : UserCreate= {
            firstName: firstName, lastName: lastName, systemRole: systemRole, userName: userName
        };
        const result = await  this.userBiz.CreateNewUser(data);
        if (result.isErr() ){
            return [0, result.error!]
        }
        return [data.id!,null]
    }
}