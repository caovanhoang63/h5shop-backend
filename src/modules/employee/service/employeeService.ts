import {IProviderService} from "../../provider/service/IProviderService";
import {IEmployeeService} from "./IEmployeeService";
import {inject} from "inversify";
import {TYPES} from "../../../types";
import {IProviderRepository} from "../../provider/repository/IProviderRepository";
import {IPubSub} from "../../../components/pubsub";
import {IEmployeeRepository} from "../repository/IEmployeeRepository";
import {IRequester} from "../../../libs/IRequester";
import {Employee, EmployeeCreate, employeeCreateSchema, EmployeeUpdate, employeeUpdateSchema} from "../entity/employee";
import {err, ok, ResultAsync} from "neverthrow";
import {ICondition} from "../../../libs/condition";
import {Paging} from "../../../libs/paging";
import {createEntityNotFoundError, createForbiddenError, createInternalError, Err} from "../../../libs/errors";
import {Validator} from "../../../libs/validator";
import {SystemRole} from "../../user/entity/user";

export class EmployeeService implements IEmployeeService {
    constructor(
        @inject(TYPES.IEmployeeRepository) private readonly repo: IEmployeeRepository,
        @inject(TYPES.IPubSub) private readonly pubSub: IPubSub,
    ) {
    }

    create(requester: IRequester, c: EmployeeCreate): ResultAsync<void, Err> {
        // @ts-ignore
        return ResultAsync.fromPromise(
            (async () => {
                const vr = await Validator(employeeCreateSchema, c)
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

    delete(requester: IRequester, id: number): ResultAsync<void, Err> {
        // @ts-ignore
        return ResultAsync.fromPromise(
            (async () => {
                if (requester.systemRole != SystemRole.Admin &&  requester.systemRole != SystemRole.Owner) {
                    return err(createForbiddenError())
                }

                const old = await this.repo.findById(id)

                if (old.isErr())
                    return err(old.error)

                if (!old.value)
                    return err(createEntityNotFoundError("Employee"))


                const result = await this.repo.delete(id)
                if (result.isErr())
                    return err(result.error)

                /*this.pubSub.Publish(topicDeleteSpu,createMessage(old.value,requester))*/
                return ok(undefined)
            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }

    findById(id: number): ResultAsync<Employee | null, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                const result = await this.repo.findById(id)
                if (result.isErr())
                    return err(result.error)
                if (!result.value) {
                    return err(createEntityNotFoundError("Employee"))
                }
                return ok(result.value)
            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }

    list(cond: ICondition, paging: Paging): ResultAsync<Employee[] | null, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                const result = await this.repo.list(cond,paging)
                if (result.isErr())
                    return err(result.error)
                return ok(result.value)
            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }

    update(requester: IRequester, id: number, c: EmployeeUpdate): ResultAsync<void, Err> {
        // @ts-ignore
        return ResultAsync.fromPromise(
            (async () => {
                const vr = await Validator(employeeUpdateSchema,c)
                if (vr.isErr())
                    return err(vr.error)

                const old = await this.repo.findById(id)

                if (old.isErr())
                    return err(old.error)

                if (!old.value)
                    return err(createEntityNotFoundError("Employee"))

                const result = await this.repo.update(id,c)
                if (result.isErr())
                    return err(result.error)

                /*this.pubSub.Publish(topicUpdateSpu,createMessage({
                    id: id,
                    old: old.value,
                    new: c
                },requester))*/

                return ok(undefined)
            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }
}
