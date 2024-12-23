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

@injectable()
export class CustomerService implements ICustomerService{
    constructor(@inject(TYPES.ICustomerRepository) private readonly customerRepository: ICustomerRepository) {
    }

    create = (requester: IRequester, c: CustomerCreate): ResultAsync<void, Err> => {
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

                return ok(undefined);
            })(), e => createInternalError(e)
        ).andThen(r => r)
    }

    update = (requester: IRequester, id: number, c: CustomerUpdate): ResultAsync<void, Err> => {
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

                return ok(undefined);
            })(), e => createInternalError(e)
        ).andThen(r => r)
    }

    delete(requester: IRequester, id: number): ResultAsync<void, Err> {
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
}