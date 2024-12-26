import {ResultAsync} from "neverthrow";
import {Image} from "../../../libs/image";
import {Err} from "../../../libs/errors";

export interface IUploadService {
    uploadImage(file: Express.Multer.File): ResultAsync<Image , Err>;
    uploadImages(files: File[]): ResultAsync<Image[] , Err>;
}