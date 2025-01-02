import {IAppContext} from "../../components/appContext/appContext";
import express from "express";
import {container} from "../../container";
import {IUploadService} from "../../modules/upload/service/IUploadService";
import {TYPES} from "../../types";
import {UploadApi} from "../../modules/upload/transport/uploadApi";
import multer from "multer";
import {randomUUID} from "node:crypto";

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        const uniqueSuffix = randomUUID();

        const sanitizedFileName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '');

        cb(null, `${uniqueSuffix}-${sanitizedFileName}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter(req, file , cb) {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Please upload an image"));
        }
    }
});

const uploadRouter = (appContext: IAppContext) => {
    const router = express.Router();
    const UploadService = container.get<IUploadService>(TYPES.IUploadService)
    const uploadApi = new UploadApi(UploadService);

    router.post('/image', upload.single("file"), uploadApi.uploadImage())
    return router
}

export default uploadRouter;