import {IHasher} from "../modules/auth/service/implementation/authService";
import CryptoJS from "crypto-js";
import {injectable} from "inversify";

@injectable()
export class Hasher implements IHasher {
    hash(value: string, salt: string) {
        return CryptoJS.SHA256(CryptoJS.enc.Hex.parse(value + salt)).toString(CryptoJS.enc.Hex);
    };
}
