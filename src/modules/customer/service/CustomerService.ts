import {inject, injectable} from "inversify";
import {ICustomerService} from "./ICustomerService";
import {ICustomerRepository} from "../repo/ICustomerRepository";
import {TYPES} from "../../../types";
import {createInternalError, Err} from "../../../libs/errors";
import {err, ok, ResultAsync} from "neverthrow";
import {CustomerCreate, customerCreateSchema} from "../entity/customerCreate";
import {Validator} from "../../../libs/validator";
import {IRequester} from "../../../libs/IRequester";
import {CustomerUpdate, customerUpdateSchema} from "../entity/customerUpdate";
import {Customer} from "../entity/customer";

@injectable()
export class CustomerService implements ICustomerService{
    constructor(@inject(TYPES.ICustomerRepository) private readonly customerRepository: ICustomerRepository) {
    }

    create = (requester: IRequester, c: CustomerCreate): ResultAsync<Customer, Err> => {
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

                return ok(r.value);
            })(), e => createInternalError(e)
        ).andThen(r => r)
    }

    update = (requester: IRequester, id: string, c: CustomerUpdate): ResultAsync<Customer, Err> => {
        return ResultAsync.fromPromise(
            (async () => {
                const vR = (await Validator(customerUpdateSchema, c))
                if (vR.isErr()) {
                    return err(vR.error);
                }

                const r = await this.customerRepository.update(id, c);
                if (r.isErr()) {
                    return err(r.error);
                }

                return ok(r.value);
            })(), e => createInternalError(e)
        ).andThen(r => r)
    }

    delete(requester: IRequester, id: string): ResultAsync<void, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                const r = await this.customerRepository.delete(id);
                if (r.isErr()) {
                    return err(r.error);
                }

                return ok(undefined);
            })(), e => createInternalError(e)
        ).andThen(r => r)
    }

    findById(requester: IRequester, id: string): ResultAsync<Customer, Err> {
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

    list(requester: IRequester): ResultAsync<Customer[], Err> {
        return ResultAsync.fromPromise(
            (async () => {
                const r = await this.customerRepository.list();
                if (r.isErr()) {
                    return err(r.error);
                }

                return ok(r.value);
            })(), e => createInternalError(e)
        ).andThen(r => r)
    }

    increasePaymentAmount(id: string): ResultAsync<void, Err> {
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