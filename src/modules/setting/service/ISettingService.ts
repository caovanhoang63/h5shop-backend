import {IRequester} from "../../../libs/IRequester";
import {ResultAsync} from "neverthrow";
import {Paging} from "../../../libs/paging";
import {Setting, SettingCreate, SettingFilter, SettingUpdate} from "../entity/setting";

export interface ISettingService {
    create(requester: IRequester, create: SettingCreate): ResultAsync<void, Error>;
    update(requester: IRequester, name: string, update: SettingUpdate): ResultAsync<void, Error>;
    delete(requester: IRequester, name: string): ResultAsync<void, Error>;
    findByName(name: string): ResultAsync<Setting, Error>;
    Find(filter: SettingFilter, page: Paging): ResultAsync<Setting[], Error>;
}