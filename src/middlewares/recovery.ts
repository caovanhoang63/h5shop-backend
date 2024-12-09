import express from "express";
import {writeErrorResponse} from "../libs/writeErrorResponse";


const recovery: express.ErrorRequestHandler = (err, req, res, next) => {
    if (err) {
        writeErrorResponse(res, err)
        console.log(err)
    }
    next(err)
}


export default recovery;