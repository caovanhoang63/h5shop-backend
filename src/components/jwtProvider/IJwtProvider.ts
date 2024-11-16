import jwt from "jsonwebtoken";
import {Err} from "../../libs/errors";
import {Nullable} from "../../libs/nullable";
import {err, ok, Result} from "neverthrow";
import {injectable} from "inversify";


export interface IJwtProvider {
    ParseToken: (token: string) => Result<Nullable<JwtClaim>, Err>
    IssueToken: (id: string, sub: string, expiredTime: number) => [string, number]
}

export const defaultExpireAccessTokenInSeconds = 60 * 60; // 1 hour
export const defaultExpireRefreshTokenInSeconds = 60 * 60 * 24 * 7; // 7 days

export const InvalidToken = (e?: any) =>
    new Err({
        code: 403, key: "ERR_INVALID_TOKEN", message: "Invalid token", metadata: undefined, originalError: e

    })
export interface JwtClaim {
    id: string, // this is the token id
    sub: string,
    notBefore: number,
    issuedAt: number,
    expiresAt: number,
}

@injectable()
export class jwtProvider implements IJwtProvider {
    constructor(
    ) {

    }

    private readonly _secret = "sjdhaskdhaskdasddjk"

    ParseToken = (token: string): Result<Nullable<JwtClaim>, Err> => {
        try {
            const claim = jwt.verify(token, this._secret) as JwtClaim
            return ok(claim)
        } catch (e) {
            return err(InvalidToken(e))
        }
    }

    IssueToken = (id: string, sub: string, expiredTime: number): [string, number] => {
        const now = (new Date()).getTime();
        // need to time 1000 because the timestamp is in millisecond
        const expiresAt = now + (expiredTime * 1000);
        const claim: JwtClaim = {
            id: id,
            sub: sub,
            notBefore: now,
            issuedAt: now,
            expiresAt: expiresAt,
        }
        console.log(this._secret)
        const token = jwt.sign(
            claim, this._secret, {algorithm: 'HS256'}
        )
        return [token, expiresAt]
    }

}