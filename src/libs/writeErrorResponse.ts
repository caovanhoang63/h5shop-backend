import express from "express";
import {AppError, newInternalError} from "./errors";
import {AppResponse} from "./response";

export const writeErrorResponse = (res: express.Response, err?: any) => {
    if (err && err instanceof AppError) {
        res.status(err.code).send(AppResponse.ErrorResponse(err));
        console.log(err)

        return
    }
    res.status(500).send(AppResponse.ErrorResponse(newInternalError(err)));
    console.log(err)

}