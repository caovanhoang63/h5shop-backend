import {ICondition} from "./condition";

export class SqlHelper {

    private static camelToSnakeCase(str: string): string {
        return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    }
    private  static snakeToCamelCase(str: string): string {
        return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    }

    public static ConvertKeysToCamelCase(obj: any): any {
        if (Array.isArray(obj)) {
            return obj.map(item => this.ConvertKeysToCamelCase(item));
        }

        if (obj !== null && typeof obj === 'object') {
            const camelObj: any = {};

            Object.keys(obj).forEach(key => {
                const camelKey = this.snakeToCamelCase(key);
                camelObj[camelKey] = this.ConvertKeysToCamelCase(obj[key]);
            });

            return camelObj;
        }

        return obj;
    }


    private static convertKeysToSnakeCase(obj: any): any {
        if (Array.isArray(obj)) {
            return obj.map(v => this.convertKeysToSnakeCase(v));
        } else if (obj !== null && typeof obj === 'object') {
            return Object.keys(obj).reduce((acc, key) => {
                const snakeKey = this.camelToSnakeCase(key);
                acc[snakeKey] = this.convertKeysToSnakeCase(obj[key]);
                return acc;
            }, {} as any);
        }
        return obj;
    }

    public static BuildWhereClause(conditions: ICondition): [string, any[]] {
        const clauses: string[] = [];
        const values: any[] = [];

        const snakeCaseConditions = this.convertKeysToSnakeCase(conditions);

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

    public static BuildSetClause(updates: any): [string, any[]] {
        const setClauses: string[] = [];
        const values: any[] = [];

        const snakeCaseUpdates = this.convertKeysToSnakeCase(updates);

        Object.entries(snakeCaseUpdates).forEach(([field, value]) => {
            if (value !== undefined && value !== null) {
                setClauses.push(`${field} = ?`);
                values.push(value);
            }
        });

        return [
            setClauses.length > 0 ? `SET ${setClauses.join(', ')}` : '',
            values
        ];
    }


}