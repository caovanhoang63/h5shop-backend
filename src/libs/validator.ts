import {ResultAsync} from "./resultAsync";
import {ObjectSchema} from "joi";
import {Err, Ok} from "./result";
import {InternalError, InvalidData} from "./errors";

export const Validator = (validateSchema: ObjectSchema, data: any ) : ResultAsync<void> => {
    return ResultAsync.fromPromise(
        validateSchema.validateAsync(data).then(
          r => {
              return Ok<void>(undefined)
          }
        ).catch((e : Error) => {
                return Err<void>(InvalidData(e))
            }
        ).catch(
            e => {
                return Err<void>(InternalError(e))
            }
        )
    )
}