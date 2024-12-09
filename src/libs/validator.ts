import {ResultAsync} from "neverthrow";
import {createInternalError, createInvalidDataError, Err} from "./errors";
import {ObjectSchema} from "joi";

export const Validator = (validateSchema: ObjectSchema, data: any): ResultAsync<void, Err> => {
    return ResultAsync.fromPromise(
        validateSchema.validateAsync(data),
        e => {
            if (e instanceof Error)
                return createInvalidDataError(e);
            else
                return createInternalError(e);
        }
    )
}