import {HttpException, HttpStatus, Inject, Injectable, NestMiddleware} from '@nestjs/common';
import {Request, Response, NextFunction} from 'express';
import {ITokenService} from "../../core/services/TokenService/interface/ITokenService";

@Injectable()
export class CheckAuthMiddleware implements NestMiddleware {
    constructor(
        @Inject(ITokenService)
        private readonly tokenService: ITokenService,
    ) {
    }

    use(req: Request, res: Response, next: NextFunction) {
        const authorizationHeader = req.headers.authorization
        if (!authorizationHeader) {
            return next(new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED))
        }
        const accessToken = authorizationHeader.split(' ')[1]
        if (!accessToken) {
            return next(new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED))
        }
        const userData = this.tokenService.validateAccessToken(accessToken)
        if (!userData) {
            return next(new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED))
        }
        req["user"] = userData
        next();
    }
}
