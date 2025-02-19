import {ICondition} from "./condition";
import _, {camelCase, snakeCase} from "lodash";
import {Paging} from "./paging";


export class SqlHelper {


    public static toCamelCase = (row: any,...omits: string[]) => {
        const newRow: any = {};
        for (const key in row) {
            newRow[camelCase(key)] = row[key];
        }
        if (omits.length > 0) {
            return _.omit(newRow, omits);
        }
        return newRow;
    };

    public static toSnackCase = (row: any) => {
        const newRow: any = {};
        for (const key in row) {
            newRow[snakeCase(key)] = row[key];
        }
        return newRow
    }

    public static buildUpdateClause(data : any) : [string,any[]] {
        const clauses: string[] = [];
        const values: any[] = [];
        const snakeCase = this.toSnackCase(data);
        Object.entries(snakeCase).forEach(([key, value]) => {
            if (value != undefined) {
                clauses.push(` ${key} = ? `);
                values.push(value);
            }
        })
        return [
            clauses.join(','),
            values
        ]
    }

    public static buildPaginationClause(paging: Paging): string {
        if (!paging) {
            return ""
        }
        let clause = ` LIMIT ${paging.limit} `
        if (paging.cursor) {
            clause = `AND id < ${paging.cursor}` + clause;
        } else {
            clause += `OFFSET ${(paging.page -1 ) * paging.limit}`;
        }

        return clause;
    }

    public static buildWhereClause(conditions: ICondition, table?:string): [string, any[]] {
        const clauses: string[] = [];
        const values: any[] = [];

        const snakeCaseConditions = this.toSnackCase(conditions);

        Object.entries(snakeCaseConditions).forEach(([field, value]) => {
            if (value !== undefined && value !== null) {
                if (Array.isArray(value)) {
                    const placeholders = value.map(() => '?').join(',');
                    if(table !=null){
                        clauses.push(`${table}.${field} IN (${placeholders})`);
                        values.push(...value);
                    }else{
                        clauses.push(`${field} IN (${placeholders})`);
                        values.push(...value);
                    }
                } else if ( field.startsWith('lk_',0)) {
                    if(table !=null){
                        clauses.push(`${table}.${field.split('_').slice(1).join("_")} LIKE concat('%' ,?, '%')`);
                        values.push(value);
                    }else{
                        clauses.push(`${field.split('_').slice(1).join("_")} LIKE concat('%' ,?, '%')`);
                        values.push(value);
                    }
                } else if (field.startsWith("date_",0)) {
                    if(table !=null){
                        clauses.push(`${table}.${field.split('_').slice(1).join("_")} = DATE(?)`);
                        values.push(value);
                    }else{
                        clauses.push(`${field.split('_').slice(1).join("_")} = DATE(?)`);
                        values.push(value);
                    }
                }
                else {
                    switch (field) {
                        case 'gt_created_at' :
                            if(table!=null){
                                clauses.push(`${table}.created_at > ?`);
                                values.push(value);
                                break;
                            }
                            clauses.push(`created_at > ?`);
                            values.push(value);
                            break;
                        case 'lt_created_at' :
                            if(table!=null){
                                clauses.push(`${table}.created_at < ?`);
                                values.push(value);
                                break;
                            }
                            clauses.push(`created_at < ?`);
                            values.push(value);
                            break;
                        case 'gt_updated_at' :
                            if(table!=null){
                                clauses.push(`${table}.updated_at > ?`);
                                values.push(value);
                                break;
                            }
                            clauses.push(`updated_at > ?`);
                            values.push(value);
                            break;
                        case 'lt_updated_at' :
                            if(table!=null){
                                clauses.push(`${table}.updated_at < ?`);
                                values.push(value);
                                break;
                            }
                            clauses.push(`updated_at < ?`);
                            values.push(value);
                            break;
                        default:
                            if (field.startsWith('gt_')) {
                                const fieldName = field.split('_').slice(1).join('_');
                                clauses.push(`${fieldName} > ?`);
                                values.push(value);
                            } else if (field.startsWith('lt_')) {
                                const fieldName = field.split('_').slice(1).join('_');
                                clauses.push(`${fieldName} < ?`);
                                values.push(value);
                            } else {
                                if(table!=null){
                                    clauses.push(`${table}.${field} = ?`);
                                    values.push(value);
                                    break;
                                }
                                clauses.push(`${field} = ?`);
                                values.push(value);
                            }
                    }
                }
            }
        });

        return [
            clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : 'WHERE 1 = 1 ',
            values
        ];
    }
}