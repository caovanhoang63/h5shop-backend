import {ObjectSchema} from "joi";
import {AppError, newInternalError, newInvalidData} from "./errors";
import {err, ok, ResultAsync} from "neverthrow";

export const Validator = (validateSchema: ObjectSchema, data: any): ResultAsync<void,AppError> => {
    return ResultAsync.fromPromise(
        validateSchema.validateAsync(data),
        e => {
            if (e instanceof Error)
                return newInvalidData(e);
            else
                return newInternalError(e);
        }
    )
}