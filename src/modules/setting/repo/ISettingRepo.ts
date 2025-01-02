import {Setting, SettingCreate, SettingFilter, SettingUpdate} from "../entity/setting";
import {ResultAsync} from "neverthrow";
import {Paging} from "../../../libs/paging";

export interface ISettingRepo {
    create( create: SettingCreate): ResultAsync<void, Error>;
    update( name: string, update: SettingUpdate): ResultAsync<void, Error>;
    delete( name: string): ResultAsync<void, Error>;
    findByName(name: string): ResultAsync<Setting|null  , Error>;
    Find(filter: SettingFilter, page: Paging): ResultAsync<Setting[], Error>;
}