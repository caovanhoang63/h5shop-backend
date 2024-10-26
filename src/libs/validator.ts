import {ResultAsync} from "./resultAsync";
import {ObjectSchema} from "joi";
import {Err, Ok} from "./result";
import {newInternalError, newInvalidData} from "./errors";

export const Validator = (validateSchema: ObjectSchema, data: any ) : ResultAsync<void> => {
    return ResultAsync.fromPromise(
        validateSchema.validateAsync(data).then(
          r => {
              return Ok<void>(undefined)
          }
        ).catch((e : Error) => {
                return Err<void>(newInvalidData(e))
            }
        ).catch(
            e => {
                return Err<void>(newInternalError(e))
            }
        )
    )
}