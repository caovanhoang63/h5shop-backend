import {PrismaClient} from "@prisma/client";
import {errAsync, ResultAsync} from "neverthrow";
import {IBaseRepo} from "./IBaseRepo";
import {createDatabaseError, Err} from "./errors";
import {prisma} from "../components/prisma";

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