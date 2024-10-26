import {IHasher} from "../modules/auth/biz/biz";
import CryptoJS from "crypto-js";

export class Hasher implements IHasher {
    hash(value: string, salt: string) {
        return CryptoJS.SHA256(CryptoJS.enc.Hex.parse(value + salt)).toString(CryptoJS.enc.Hex);
    };
}
