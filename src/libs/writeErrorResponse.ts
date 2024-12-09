import express from "express";
import {createInternalError, Err} from "./errors";
import {AppResponse} from "./response";

export const writeErrorResponse = (res: express.Response, err?: any) => {
    if (err && err instanceof Err) {
        res.status(err.code).send(AppResponse.ErrorResponse(err));
        console.log(err)
        return
    }
    res.status(500).send(AppResponse.ErrorResponse(createInternalError(err)));
    console.log(err)

}