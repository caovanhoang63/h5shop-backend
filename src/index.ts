import express, {Express} from "express";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import v1Router from "./routes/v1";
import cors from "cors"
import mysql from "mysql2"
import {AppContext} from "./components/appContext/appContext";
import recovery from "./middlewares/recovery";
import helmet from "helmet";
import bodyParser from "body-parser";
import {LocalPubSub} from "./components/pubsub/local";
import {SubscriberEngine} from "./subcriber";

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 3000;


const localPubsub = new LocalPubSub();
const appContext = new AppContext( localPubsub);
const subcriberEngine = new SubscriberEngine(appContext);


(async () => {
    await subcriberEngine.run();
})();

(async () => {
    await localPubsub.Serve()
})();

app.use(logger('dev'));
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/v1", v1Router(appContext));
app.use(recovery)


app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

