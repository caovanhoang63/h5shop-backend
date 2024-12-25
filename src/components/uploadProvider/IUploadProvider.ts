import {ResultAsync} from "neverthrow";
import {Image} from "../../libs/image";
import {Err} from "../../libs/errors";

export interface IUploadProvider{
    uploadImage: (key: string ,file: any, contentType: string) => ResultAsync<Image , Err>;
}