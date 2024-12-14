import {ISkuService} from "./ISkuService";
import {inject, injectable} from "inversify";
import {TYPES} from "../../../../types";
import {ISkuRepository} from "../repository/ISkuRepository";
import {IPubSub} from "../../../../components/pubsub";
import {ICondition} from "../../../../libs/condition";
import {Paging} from "../../../../libs/paging";
import {err, ok, ResultAsync} from "neverthrow";
import {Sku} from "../entity/sku";
import {createInternalError, Err} from "../../../../libs/errors";

@injectable()
export class SkuService implements ISkuService {
    constructor(
        @inject(TYPES.ISkuRepository) private readonly repo: ISkuRepository,
        @inject(TYPES.IPubSub) private readonly pubSub: IPubSub,
    ) {}

    list(cond: ICondition, paging: Paging): ResultAsync<Sku[] | null, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                const result = await this.repo.list(cond,paging)
                if (result.isErr())
                    return err(result.error)
                return ok(result.value)
            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }
}