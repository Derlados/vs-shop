import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AESEncryptor } from 'src/helpers/AESEncryptor';


@Injectable()
export class DecryptSessionCartMiddleware implements NestMiddleware {
    private readonly aesEncryptor: AESEncryptor;

    constructor() {
        this.aesEncryptor = new AESEncryptor(process.env.ENCRYPTION_KEY, Buffer.from(process.env.ENCRYPTION_VECTOR, "hex"))
    }

    use(req: Request, res: Response, next: NextFunction) {
        if (!req.params.id) {
            next();
            return;
        }

        const cartId = this.aesEncryptor.decrypt(req.params.id).toString();
        if (!Number.isInteger(+cartId)) {
            throw new BadRequestException();
        }
        req.url = req.url.replace(req.params.id, cartId);
        next();
    }
}
