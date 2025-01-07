export interface Token {
    token: string;
    expiredIn: number;
}

export interface TokenResponse {
    accessToken: Token;
    refreshToken?: Token;
}
