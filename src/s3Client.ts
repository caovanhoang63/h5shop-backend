import {S3Client} from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();
const accessKeyId = process.env.AWS_ACCESS_KEY || "";
const secretAccessKey = process.env.AWS_SECRET_KEY || "";
export const client = new S3Client({
    region: "ap-southeast-1",
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
    }
});

const params = {
    /** input parameters */
};
