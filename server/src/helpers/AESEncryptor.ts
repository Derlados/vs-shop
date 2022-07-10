import { Cipher, createCipheriv, createDecipheriv, Decipher, randomBytes, scrypt } from "crypto";
import { promisify } from "util";

class AESEncryptor {
    private KEY: Buffer;
    private IV: Buffer;
    private cipher: Cipher;
    private decipher: Decipher;

    constructor() {
        this.init();
    }

    async init() {
        this.KEY = (await promisify(scrypt)(process.env.AES_KEY, 'salt', 32)) as Buffer;
        this.IV = randomBytes(16);
        this.cipher = createCipheriv('aes-256-ctr', this.KEY, this.IV);
        this.decipher = createDecipheriv('aes-256-ctr', this.KEY, this.IV);
        console.log("key - " + this.KEY.toString())
    }

    encrypt(text: string) {
        return Buffer.concat([
            this.cipher.update(text),
            this.cipher.final(),
        ]);
    }

    decrypt(text: string | Buffer): Buffer {
        return Buffer.concat([
            this.decipher.update(Buffer.from(text)),
            this.decipher.final(),
        ]);
    }
}

export default new AESEncryptor();
