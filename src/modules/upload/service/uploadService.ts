import {IUploadService} from "./IUploadService";
import {inject} from "inversify";
import {err, ok, ResultAsync} from "neverthrow";
import {Image} from "../../../libs/image";
import {createInternalError, Err} from "../../../libs/errors";
import {TYPES} from "../../../types";
import {IUploadProvider} from "../../../components/uploadProvider/IUploadProvider";
import * as fs from "fs";

export class UploadService implements IUploadService {
    constructor(
        @inject(TYPES.IUploadProvider) private readonly uploadProvider: IUploadProvider,
    ) {
    }

    uploadImage(file: Express.Multer.File): ResultAsync<Image, Err> {
        return ResultAsync.fromPromise(
            (async () => {
                const filePath = file.path
                const fileName = file.filename
                const fileBuffer = fs.readFileSync(filePath)
                const contentType = file.mimetype

                const result = await this.uploadProvider.uploadImage(fileName, fileBuffer, contentType)
                if (result.isErr())
                    return err(result.error)
                console.log(result.value)
                return ok(result.value)
            })(), e => createInternalError(e)
        ).andThen(r=> r)
    }

    uploadImages(files: File[]): ResultAsync<Image[], Err> {
        throw new Error("Method not implemented.");
    }
}