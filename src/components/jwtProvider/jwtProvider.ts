import jwt from "jsonwebtoken";
import {Ok, Result} from "../../libs/result";
import {AppError} from "../../libs/errors";
import {Nullable} from "../../libs/nullable";

export interface JwtProvider {
    ParseToken: (token: string) => Result<JwtClaim>
    IssueToken: (id : string, sub : string, expiredTime: number  ) => [string,number]
}

export const defaultExpireAccessTokenInSeconds = 60 * 60; // 1 hour
export const defaultExpireRefreshTokenInSeconds = 60 * 60 * 24 * 7; // 7 days
export const InvalidToken = (e?: any ) =>
    new AppError(e,"Invalid token","ERR_INVALID_TOKEN",403)

export interface JwtClaim {
    id: string, // this is the token id
    sub: string,
    notBefore: number,
    issuedAt: number,
    expiresAt: number,
}

export class jwtProvider implements JwtProvider {
    constructor (
        private readonly _secret: string
    ) {

    }

    ParseToken =  (token: string) : Result<JwtClaim> => {
        let  er  = null ;
        let claim : Nullable<JwtClaim> = null;
        jwt.verify(token, this._secret, (err, decoded) => {
            if (err != null ) {
                er = err;
                return
            }
            claim = decoded as JwtClaim;
        })

        return new Result<JwtClaim>(claim,er)
    }

    IssueToken = (id : string, sub : string, expiredTime: number ) : [string,number] => {
        const now = (new Date()).getUTCDate();
        // need to time 1000 because the timestamp is in millisecond
        const expiresAt  = now + (expiredTime * 1000);
        const claim : JwtClaim = {
            id: id,
            sub: sub,
            notBefore: now,
            issuedAt: now,
            expiresAt: expiresAt,
        }
        const token = jwt.sign(
            claim,this._secret, {algorithm: 'HS256'}
        )
        return [token,expiresAt]
    }

}