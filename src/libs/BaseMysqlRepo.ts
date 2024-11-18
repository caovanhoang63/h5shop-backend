import {IBaseRepo} from "./IBaseRepo";
import {PrismaClient} from "@prisma/client";
import {ResultAsync} from "neverthrow";
import {Err} from "./errors";


export abstract class BaseMysqlRepo implements IBaseRepo {
    Commit(): ResultAsync<void, Err> {
        throw new Error("Method not implemented.");
    }
    Rollback(): ResultAsync<void, Err> {
        throw new Error("Method not implemented.");
    }
    Begin(): ResultAsync<void, Err> {
        throw new Error("Method not implemented.");
    }
}