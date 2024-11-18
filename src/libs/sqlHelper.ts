import {ICondition} from "./condition";
import {camelCase, snakeCase} from "lodash";
import {Paging} from "./paging";


export class SqlHelper {


    public static toCamelCase = (row: any) => {
        const newRow: any = {};
        for (const key in row) {
            newRow[camelCase(key)] = row[key];
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

    public static buildWhereClause(conditions: ICondition): [string, any[]] {
        const clauses: string[] = [];
        const values: any[] = [];

        const snakeCaseConditions = this.toSnackCase(conditions);

        Object.entries(snakeCaseConditions).forEach(([field, value]) => {
            if (value !== undefined && value !== null) {
                if (Array.isArray(value)) {
                    const placeholders = value.map(() => '?').join(',');
                    clauses.push(`${field} IN (${placeholders})`);
                    values.push(...value);
                } else {
                    clauses.push(`${field} = ?`);
                    values.push(value);
                }
            }
        });

        return [
            clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '',
            values
        ];
    }

}