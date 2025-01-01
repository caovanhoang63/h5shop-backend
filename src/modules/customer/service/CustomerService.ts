import {inject, injectable} from "inversify";
import {ICustomerService} from "./ICustomerService";
import {ICustomerRepository} from "../repo/ICustomerRepository";
import {TYPES} from "../../../types";
import {createForbiddenError, createInternalError, Err} from "../../../libs/errors";
import {err, ok, ResultAsync} from "neverthrow";
import {CustomerCreate, customerCreateSchema} from "../entity/customerCreate";
import {Validator} from "../../../libs/validator";
import {IRequester} from "../../../libs/IRequester";
import {CustomerUpdate, customerUpdateSchema} from "../entity/customerUpdate";
import {Customer} from "../entity/customer";
import {CustomerFilter} from "../entity/customerFilter";
import {Paging} from "../../../libs/paging";
import {createMessage, IPubSub} from "../../../components/pubsub";
import {topicCreateCustomer, topicDeleteCustomer, topicUpdateCustomer} from "../../../libs/topics";
import {SystemRole} from "../../user/entity/user";

@injectable()
export class CustomerService implements ICustomerService{
    constructor(
        @inject(TYPES.ICustomerRepository) private readonly customerRepository: ICustomerRepository,
        @inject(TYPES.IPubSub) private readonly pubSub: IPubSub
    ) {
    }

    create(requester: IRequester, c: CustomerCreate): ResultAsync<Customer, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                const vR = (await Validator(customerCreateSchema, c))
                if (vR.isErr()) {
                    return err(vR.error);
                }

                const r = await this.customerRepository.create(c);
                if (r.isErr()) {
                    return err(r.error);
                }

                this.pubSub.Publish(topicCreateCustomer, createMessage(c, requester));

                return ok(r.value);
            })(), e => createInternalError(e)
        ).andThen(r => r)
    }

    update(requester: IRequester, id: number, c: CustomerUpdate): ResultAsync<Customer, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                const vR = (await Validator(customerUpdateSchema, c))
                if (vR.isErr()) {
                    return err(vR.error);
                }

                const old = await this.customerRepository.findById(id);
                if (old.isErr()) {
                    return err(old.error);
                }

                const r = await this.customerRepository.update(id, c);
                if (r.isErr()) {
                    return err(r.error);
                }

                this.pubSub.Publish(topicUpdateCustomer, createMessage({
                    id: id,
                    old: old.value,
                    new: c
                }, requester));

                return ok(r.value);
            })(), e => createInternalError(e)
        ).andThen(r => r)
    }

    delete(requester: IRequester, id: number): ResultAsync<void, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                const old = await this.customerRepository.findById(id);
                if (old.isErr()) {
                    return err(old.error);
                }

                const r = await this.customerRepository.delete(id);
                if (r.isErr()) {
                    return err(r.error);
                }

                this.pubSub.Publish(topicDeleteCustomer, createMessage(old.value, requester))

                return ok(undefined);
            })(), e => createInternalError(e)
        ).andThen(r => r)
    }

    findById(id: number): ResultAsync<Customer, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                const r = await this.customerRepository.findById(id);
                if (r.isErr()) {
                    return err(r.error);
                }

                return ok(r.value);
            })(), e => createInternalError(e)
        ).andThen(r => r)
    }

    list(filter: CustomerFilter, page: Paging): ResultAsync<Customer[], Err> {
        return ResultAsync.fromPromise(
            (async () => {
                const r = await this.customerRepository.list(filter, page);
                if (r.isErr()) {
                    return err(r.error);
                }

                return ok(r.value);
            })(), e => createInternalError(e)
        ).andThen(r => r)
    }

    increasePaymentAmount(id: number): ResultAsync<void, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                const r = await this.customerRepository.increasePaymentAmount(id);
                if (r.isErr()) {
                    return err(r.error);
                }

                return ok(undefined);
            })(), e => createInternalError(e)
        ).andThen(r => r)
    }
}