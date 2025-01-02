import {ISettingService} from "./ISettingService";
import {inject, injectable} from "inversify";
import {TYPES} from "../../../types";
import {ISettingRepo} from "../repo/ISettingRepo";
import {IPubSub} from "../../../components/pubsub";
import {err, ok, ResultAsync} from "neverthrow";
import { IRequester } from "../../../libs/IRequester";
import { Paging } from "../../../libs/paging";
import {
    SettingCreate,
    SettingUpdate,
    Setting,
    SettingFilter,
    SettingCreateSchema,
    SettingUpdateSchema
} from "../entity/setting";
import {createEntityAlreadyExistError, createEntityNotFoundError, createInternalError} from "../../../libs/errors";
import {Validator} from "../../../libs/validator";


@injectable()
export class SettingService implements ISettingService {
    constructor(@inject(TYPES.ISettingRepository) private readonly settingRepo: ISettingRepo,
                @inject(TYPES.IPubSub) private pubSub: IPubSub,) {
    }
    create(requester: IRequester, create: SettingCreate): ResultAsync<void, Error> {
        return ResultAsync.fromPromise((async () => {
            const vR = await Validator(SettingCreateSchema,create)
            if (vR.isErr()) {
                return err(vR.error)
            }
            const old = await this.settingRepo.findByName(create.name)
            if (old.isErr()) {
                return err(old.error)
            }
            if (old.value) {
                return err(createEntityAlreadyExistError("setting"))
            }

            const r =await this.settingRepo.create(create)
            if (r.isErr()) {
                return err(createInternalError(r.error))
            }
            return ok(undefined)
        })(), e=> createInternalError(e)).andThen(r=>r)

    }
    update(requester: IRequester, name: string, update: SettingUpdate): ResultAsync<void, Error> {
        return ResultAsync.fromPromise((async () => {
            const vR = await Validator(SettingUpdateSchema,update)
            if (vR.isErr()) {
                return err(vR.error)
            }
            const old = await this.settingRepo.findByName(name)
            if (old.isErr()) {
                return err(old.error)
            }
            if (!old.value) {
                return err(createEntityNotFoundError("setting"))
            }
            const r = await this.settingRepo.update(name,update)

            if (r.isErr()) {
                return err(createInternalError(r.error))
            }
            return ok(undefined)

        })(), e=> createInternalError(e)).andThen(r=>r)
    }
    delete(requester: IRequester, name: string): ResultAsync<void, Error> {
        return ResultAsync.fromPromise((async () => {
            const old = await this.settingRepo.findByName(name)
            if (old.isErr()) {
                return err(old.error)
            }
            if (!old.value) {
                return err(createEntityNotFoundError("setting"))
            }
            const r = await this.settingRepo.delete(name)

            if (r.isErr()) {
                return err(createInternalError(r.error))
            }
            return ok(undefined)


        })(), e=> createInternalError(e)).andThen(r=>r)
    }
    findByName(name: string): ResultAsync<Setting, Error> {
        return ResultAsync.fromPromise((async () => {
            const old = await this.settingRepo.findByName(name)
            if (old.isErr()) {
                return err(old.error)
            }
            if (!old.value) {
                return err(createEntityNotFoundError("setting"))
            }
            return ok(old.value)
        })(), e=> createInternalError(e)).andThen(r=>r)
    }
    Find(filter: SettingFilter, page: Paging): ResultAsync<Setting[], Error> {
        return ResultAsync.fromPromise((async () => {
            return ok([])

        })(), e=> createInternalError(e)).andThen(r=>r)
    }
}