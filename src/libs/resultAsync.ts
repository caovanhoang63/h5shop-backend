// import {Err, Ok, Result} from "./result";
// import {Err} from "./errors";
//
// export class ResultAsync<T> implements PromiseLike<Result<T>> {
//     constructor(res: Promise<Result<T>>) {
//         this._promise = res
//     }
//
//     private _promise: Promise<Result<T>>
//
//     then<A, B>(
//         successCallback?: (res: Result<T>) => A | PromiseLike<A>,
//         failureCallback?: (reason: unknown) => B | PromiseLike<B>,
//     ): PromiseLike<A | B> {
//         return this._promise.then(successCallback, failureCallback)
//     }
//
//     andThen(f: any): any {
//         return new ResultAsync(
//             this._promise.then((res) => {
//                 if (res.isErr()) {
//                     return res.error;
//                 }
//
//                 const newValue = f(res.data)
//                 return newValue instanceof ResultAsync ? newValue._promise : newValue
//             }),
//         )
//     }
//
//
//     static fromPromise<T>(promise: Promise<Result<T>>) {
//         return new ResultAsync(Promise.resolve(promise))
//     }
//
// }
//
// export const okAsync = <T>(value: T): ResultAsync<T> =>
//     new ResultAsync(Promise.resolve(Ok(value)));
//
// export const errAsync = <T>(err: Err): ResultAsync<T> =>
//     new ResultAsync(Promise.resolve(Err(err)))
