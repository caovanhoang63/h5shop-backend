import {IUploadProvider} from "./IUploadProvider";
import {err, ok, okAsync, ResultAsync} from "neverthrow";
import {Image} from "../../libs/image";
import {createEntityNotFoundError, createInternalError, Err} from "../../libs/errors";
import {client} from "../../s3Client";
import {PutObjectCommand} from "@aws-sdk/client-s3";
import {Validator} from "../../libs/validator";
import {brandUpdateScheme} from "../../modules/catalog/brand/entity/brandUpdate";
import {topicUpdateBrand} from "../../libs/topics";
import {createMessage} from "../pubsub";

export class S3Provider implements IUploadProvider {
    private bucketName: string;
    private baseUrl: string;

    constructor(bucketName: string, baseUrl: string) {
        this.bucketName = bucketName;
        this.baseUrl = baseUrl;
    }

    uploadImage(key: string, file: any): ResultAsync<Image, Err> {
        const input = {
            Body: file,
            Bucket: this.bucketName,
            Key: key,
        }
        return ResultAsync.fromPromise(
            (async () => {
                const command = new PutObjectCommand(input);
                const response = await client.send(command);
                if(response.$metadata.httpStatusCode === 200){
                    return okAsync({
                        id : "0",
                        width : 0,
                        height : 0,
                        url: `${this.baseUrl}/${key}`,
                        extension : key.split(".").pop() || "",
                        cloud: "",
                    } as Image)
                }
                return err(createInternalError())
            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }

}