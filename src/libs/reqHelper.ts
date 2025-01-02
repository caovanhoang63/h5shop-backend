import {Paging} from "./paging";
import {ParsedQs} from "qs";
import {IRequester, RequesterKey} from "./IRequester";
import express from "express";

export class ReqHelper {
    static getPaging(query: ParsedQs): Paging {
        // Extract and parse `page` and `limit` from query.
        const page = parseInt(query.page as string, 10) || 1; // Default to 1 if not provided or invalid.
        const limit = parseInt(query.limit as string, 10) || 20; // Default to 20 if not provided or invalid.
        const cursor = parseInt(query.cursor as string, 10) || undefined;
        // Return an instance of the Paging class.
        const paging = new Paging(page, limit)

        if (cursor) {
            console.log(cursor);
            paging.cursor = cursor
        }
        return paging;
    }

    static getRequester(res: express.Response): IRequester {
        const r = res.locals[RequesterKey] as IRequester || {}
        r.userAgent = res.locals["userAgent"]
        r.ipAddress = res.locals["ipAddress"]

        return r;
    }
}