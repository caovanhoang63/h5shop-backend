import "reflect-metadata";
import express, {Express} from "express";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import v1Router from "./routes/v1";
import cors from "cors"
import {AppContext, IAppContext} from "./components/appContext/appContext";
import recovery from "./middlewares/recovery";
import helmet from "helmet";
import bodyParser from "body-parser";
import {LocalPubSub} from "./components/pubsub/local";
import {SubscriberEngine} from "./components/subcriber";
import {TopicTest} from "./libs/topics";
import {IPubSub, Message} from "./components/pubsub";
import {okAsync, ResultAsync} from "neverthrow";
import {Err} from "./libs/errors";
import subscriberEngine from "./subcribers";
import {container} from "./container";
import {TYPES} from "./types";

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 3000;

(async () => {
    await subscriberEngine.run();
})();


app.use(logger('dev'));
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/v1", v1Router());
app.use(recovery)


app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

