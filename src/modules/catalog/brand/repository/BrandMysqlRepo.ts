import {BaseMysqlRepo} from "../../../../components/mysql/BaseMysqlRepo";
import {IBrandRepository} from "./IBrandRepository";
import {BrandCreate} from "../entity/brandCreate";
import {okAsync, ResultAsync} from "neverthrow";
import {Err} from "../../../../libs/errors";
import {ResultSetHeader} from "mysql2";
import {ICondition} from "../../../../libs/condition";
import {Paging} from "../../../../libs/paging";

export class BrandMysqlRepo extends BaseMysqlRepo implements IBrandRepository {
    create(c: BrandCreate): ResultAsync<void, Err> {
        const query = `INSERT INTO brand (name) VALUES (?) `;
        return this.executeQuery(query, [c.name,]).andThen(
            ([r,f]) => {
                const header = r as ResultSetHeader;
                return okAsync(undefined)
            }
        )
    }

    update(id: number, c: BrandCreate): ResultAsync<void, Err> {
        throw new Error("Method not implemented.");
    }

    delete(id: number): ResultAsync<void, Err> {
        throw new Error("Method not implemented.");
    }

    list(cond: ICondition, paging: Paging): ResultAsync<BrandCreate[] | null, Err> {
        throw new Error("Method not implemented.");
    }

    findById(id: number): ResultAsync<BrandCreate | null, Err> {
        throw new Error("Method not implemented.");
    }
}