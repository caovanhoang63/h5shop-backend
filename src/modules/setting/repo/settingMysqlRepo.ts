import {ok, ResultAsync} from "neverthrow";
import {BaseMysqlRepo} from "../../../components/mysql/BaseMysqlRepo";
import {Paging} from "../../../libs/paging";
import {SettingCreate, SettingUpdate, Setting, SettingFilter} from "../entity/setting";
import {ISettingRepo} from "./ISettingRepo";
import {injectable} from "inversify";
import {ResultSetHeader, RowDataPacket} from "mysql2";
import {SqlHelper} from "../../../libs/sqlHelper";

@injectable()
export class SettingMysqlRepo extends BaseMysqlRepo implements ISettingRepo {
    create(create: SettingCreate): ResultAsync<void, Error> {
        const query = `INSERT INTO system_settings(name, value, description) VALUES (?,?,?)`
        return this.executeQuery(query,[create.name,JSON.stringify(create.value),create.description]).andThen(
            ([r,f]) =>{
                const header =r as ResultSetHeader
                create.id = header.insertId
                return ok(undefined)
            }
        )
    }
    update(name: string, update: SettingUpdate): ResultAsync<void, Error> {
        update.value = update.value ? JSON.stringify(update.value) : update.value;
        const [clause,value] = SqlHelper.buildUpdateClause(update)
        const query = `UPDATE  system_settings SET ${clause} WHERE name = ?`
        return this.executeQuery(query,[...value,name]).andThen(
            ([r,f]) =>{
                return ok(undefined)
            }
        )
    }
    delete(name: string): ResultAsync<void, Error> {
        const query = `DELETE FROM system_settings WHERE name = ?`
        return this.executeQuery(query,[name]).andThen(
            ([r,f]) =>{
                return ok(undefined)
            }
        )
    }
    findByName(name: string): ResultAsync<Setting | null, Error> {
        const query = `SELECT * FROM system_settings WHERE name = ?`
        return this.executeQuery(query,[name]).andThen(
            ([r,f]) =>{
                const firstRow = (r as RowDataPacket[])[0];
                if(!firstRow) {
                    return ok(null);
                }
                return ok(SqlHelper.toCamelCase(firstRow) as Setting)
            }
        )
    }
    Find(filter: SettingFilter, page: Paging): ResultAsync<Setting[], Error> {
        throw new Error("Method not implemented.");
    }
}