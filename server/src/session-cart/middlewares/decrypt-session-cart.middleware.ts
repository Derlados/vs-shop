import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import AESEncryptor from 'src/helpers/AESEncryptor';

@Injectable()
export class DecryptSessionCartMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        if (!req.params.id) {
            next();
        }

        const cartId = AESEncryptor.decrypt(req.params.id).toString();
        if (!Number.isInteger(cartId)) {
            throw new BadRequestException();
        }
        req.params.id = cartId
        next();
    }
}
