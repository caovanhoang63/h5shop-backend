import {Paging} from "./paging";
import {Err} from "./errors";

export interface IResponse {
    data: any,
    paging?: Paging
    extra?: any
}

export interface IErrorResponse {
    message: string,
    code: number,
}

export class AppResponse {
    public static SimpleResponse(data: any): IResponse {
        return {
            data: data
        }
    }

    public static SuccessResponse(data: any, paging: Paging, extra: any): IResponse {
        return {
            data: data,
            extra: extra,
            paging: paging
        }
    }

    public static ErrorResponse(err: Err): IErrorResponse {
        return {
            code: err.code,
            message: err.message,
        }
    }
}