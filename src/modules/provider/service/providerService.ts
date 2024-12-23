import {err, ok, ResultAsync} from "neverthrow";
import {IRequester} from "../../../libs/IRequester";
import {Provider, ProviderCreate, providerCreateSchema, ProviderUpdate} from "../entity/provider";
import {IProviderService} from "./IProviderService";
import {Paging} from "../../../libs/paging";
import {ICondition} from "../../../libs/condition";
import {inject} from "inversify";
import {TYPES} from "../../../types";
import {createMessage, IPubSub} from "../../../components/pubsub";
import {IProviderRepository} from "../repository/IProviderRepository";
import {Validator} from "../../../libs/validator";
import {createInternalError, Err} from "../../../libs/errors";

export class ProviderService implements IProviderService {

    constructor(
        @inject(TYPES.IProviderRepository) private readonly repo: IProviderRepository,
        @inject(TYPES.IPubSub) private readonly pubSub: IPubSub,
    ) {
    }

    create(requester: IRequester, c: ProviderCreate): ResultAsync<void, Err> {
        // @ts-ignore
        return ResultAsync.fromPromise(
            (async () => {
                const vr = await Validator(providerCreateSchema, c)
                if (vr.isErr())
                    return err(vr.error)

                const result = await this.repo.create(c)
                if (result.isErr())
                    return err(result.error)

                /*this.pubSub.Publish(topicCreateBrand,createMessage(c,requester))*/
                return ok(result.value)
            })(), e => createInternalError(e)
        ).andThen(r => r)
    }

    /*delete(requester: IRequester, id: number): ResultAsync<void, Err> {
        return undefined;
    }

    list(cond: ICondition, paging: Paging): ResultAsync<Provider[] | null, Err> {
        return undefined;
    }

    update(requester: IRequester, id: number, c: ProviderUpdate): ResultAsync<void, Err> {
        return undefined;
    }*/

}