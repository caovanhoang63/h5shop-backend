import express from "express";
import {AppError, InternalError} from "../libs/errors";
import {AppResponse} from "../libs/response";


const recovery: express.ErrorRequestHandler  = (err ,req , res, next) => {
    console.log("RECOVERY CATCH")
    if (err instanceof AppError) {
        res.status(err.code).send(AppResponse.ErrorResponse(err));
    } else {
        const internalErr = InternalError(err)
        res.status(internalErr.code).send(AppResponse.ErrorResponse(internalErr));
    }

    console.log(err)
    next(err)
}


export default recovery;