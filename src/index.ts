import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import v1Router from "./routes/v1";
import cors from "cors"
import mysql from "mysql2"
import {AppContext} from "./components/appContext/appContext";

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 3000;


const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.query("SELECT 1 + 1")



const appContext = new AppContext(pool);

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/v1",v1Router(appContext));

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});