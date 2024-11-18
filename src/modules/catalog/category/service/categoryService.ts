import { Category } from "@prisma/client";
import {err, ok, ResultAsync} from "neverthrow";
import { ICondition } from "../../../../libs/condition";
import {createEntityNotFoundError, createForbiddenError, createInternalError, Err} from "../../../../libs/errors";
import { IRequester } from "../../../../libs/IRequester";
import { Paging } from "../../../../libs/paging";
import {categoryCreate, categoryCreateScheme} from "../entity/categoryCreate";
import {categoryUpdate, categoryUpdateScheme} from "../entity/categoryUpdate";
import {ICategoryService} from "./ICategoryService";
import {inject, injectable} from "inversify";
import {TYPES} from "../../../../types";
import {ICategoryRepository} from "../repository/ICategoryRepository";
import {Validator} from "../../../../libs/validator";
import {SystemRole} from "../../../user/entity/user";
import {createMessage, IPubSub} from "../../../../components/pubsub";
import {topicCreateCategory, topicDeleteCategory, topicUpdateCategory} from "../../../../libs/topics";

@injectable()
export class CategoryService implements ICategoryService {
    constructor(@inject(TYPES.ICategoryRepository) private readonly repo : ICategoryRepository,
                @inject(TYPES.IPubSub) private readonly pubSub : IPubSub,) {
    }

    create(requester: IRequester, c: categoryCreate): ResultAsync<void, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                const vr = await Validator(categoryCreateScheme,c)
                if (vr.isErr())
                    return err(vr.error)

                const result = await this.repo.create(c)
                if (result.isErr())
                    return err(result.error)

                this.pubSub.Publish(topicCreateCategory,createMessage(c,requester))
                return ok(undefined)
            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }

    update(requester: IRequester, id: number, c: categoryUpdate): ResultAsync<void, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                const vr = await Validator(categoryUpdateScheme,c)
                if (vr.isErr())
                    return err(vr.error)

                const old = await this.repo.findById(id)

                if (old.isErr())
                    return err(old.error)

                if (!old.value)
                    return err(createEntityNotFoundError("category"))

                const result = await this.repo.update(id,c)
                if (result.isErr())
                    return err(result.error)

                this.pubSub.Publish(topicUpdateCategory,createMessage({
                    id: id,
                    old: old.value,
                    new: c
                },requester))

                return ok(undefined)
            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }

    delete(requester: IRequester, id: number): ResultAsync<void, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                if (requester.systemRole != SystemRole.Admin &&  requester.systemRole != SystemRole.Owner) {
                    return err(createForbiddenError())
                }

                const old = await this.repo.findById(id)

                if (old.isErr())
                    return err(old.error)

                if (!old.value)
                    return err(createEntityNotFoundError("category"))


                const result = await this.repo.delete(id)
                if (result.isErr())
                    return err(result.error)

                this.pubSub.Publish(topicDeleteCategory,createMessage(old.value,requester))
                return ok(undefined)
            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }

    list(cond: ICondition, paging: Paging): ResultAsync<Category[] | null, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                const result = await this.repo.list(cond,paging)
                if (result.isErr())
                    return err(result.error)
                return ok(result.value)
            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }

    findById(id: number): ResultAsync<Category | null, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                const result = await this.repo.findById(id)
                if (result.isErr())
                    return err(result.error)
                if (!result.value) {
                    return err(createEntityNotFoundError("category"))
                }
                return ok(result.value)
            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }
}