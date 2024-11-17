import express from "express";

const requestContext: express.Handler = (req, res, next) => {
    res.locals.userAgent = req.get('User-Agent');
    res.locals.ipAddress = req.ip;
    next()
}


export default requestContext;