import { Cipher, createCipheriv, createDecipheriv, Decipher, randomBytes, scrypt } from "crypto";
import { promisify } from "util";

export class AESEncryptor {
    private KEY: Buffer;
    private IV: Buffer;

    constructor(key: string, iv: Buffer) {
        this.init(key, iv);
    }

    async init(key: string, iv: Buffer) {
        this.KEY = (await promisify(scrypt)(key, 'salt', 32)) as Buffer;
        this.IV = iv;
    }

    encrypt(text: string): string {
        const cipher = createCipheriv('aes-256-ctr', this.KEY, this.IV);
        return cipher.update(text, "utf-8", "hex") + cipher.final("hex");
    }

    decrypt(text: string): string {
        const decipher = createDecipheriv('aes-256-ctr', this.KEY, this.IV);
        return decipher.update(text, "hex", "utf-8") + decipher.final("utf-8");
    }
}
