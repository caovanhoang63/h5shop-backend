import {PrismaClient} from "@prisma/client";
import {ResultAsync} from "neverthrow";
import {IBaseRepo} from "./IBaseRepo";
import {Err} from "./errors";

export abstract class BaseRepository implements IBaseRepo {
    protected transactionClient: PrismaClient | null = null;

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