import "reflect-metadata";
import express, {Express} from "express";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import v1Router from "./routes/v1";
import cors from "cors"
import recovery from "./middlewares/recovery";
import helmet from "helmet";
import bodyParser from "body-parser";
import subscriberEngine from "./subcribers";
import requestContext from "./middlewares/requestContext";
import conPool from "./mysql";

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 3000;

(async () => {
    await subscriberEngine.run();
})();

try {
    const promisePool = conPool.query("SELECT 1 + 1")
    console.log("Connect database success!")
} catch (e) {
    console.error(e);
    throw e;
}

(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};
app.use(logger('dev'));
app.use(cors());
app.use(helmet());
app.use(requestContext)
app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/v1", v1Router());
app.use(recovery)


app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

