import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Inject,
    Param,
    Post, Req,
    Res,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import {IUserService} from '../../../../core/services/UserService/interface/IUserService';
import {Request, Response} from 'express';
import {ResponseInterceptor} from '../../../interceptors/ResponseInterceptor';
import * as process from 'process';
import {ITokenService} from "../../../../core/services/TokenService/interface/ITokenService";
import {SignUpRequestDto} from "./requests/SignUpRequest.dto";
import {SignInRequestDto} from "./requests/SignInRequest.dto";
import {UserResponse} from "../../UserControllers/UserHttpController/responses/UserResponse";
import {IAuthService} from "../../../../core/services/AuthService/interface/IAuthService";
import {ISessionService} from "../../../../core/services/SessionService/interface/ISessionService";

@Controller('auth')
@UseInterceptors(ResponseInterceptor)
export class AuthHttpController {
    constructor(
        @Inject(IUserService)
        private readonly userService: IUserService,
        @Inject(ITokenService)
        private readonly tokenService: ITokenService,
        @Inject(IAuthService)
        private readonly authService: IAuthService,
        @Inject(ISessionService)
        private readonly sessionService: ISessionService,
    ) {
    }

    @UsePipes(new ValidationPipe())
    @Post('sign-up')
    async signUp(
        @Body() body: SignUpRequestDto,
    ) {
        try {
            const data = await this.authService.signUp(body);
            delete data.user.password
            return data;
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    @UsePipes(new ValidationPipe())
    @Get('activate/:link')
    async activate(
        @Param('link') link: string,
        @Res() response: Response
    ) {
        try {
            await this.userService.activate(link);
            return response.redirect(process.env.CLIENT_URL);
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    @UsePipes(new ValidationPipe())
    @Post('sign-in')
    async signIn(
        @Body() body: SignInRequestDto,
        @Res({passthrough: true}) response: Response,
    ) {
        try {
            const data = await this.authService.signIn(body);
            response.cookie('refreshToken', data.tokens.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            return {
                user: new UserResponse(data.user),
                tokens: data.tokens
            };
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    @Get('log-out')
    async logOut(
        @Req() request: Request,
        @Res() response: Response,
    ) {
        try {
            const {refreshToken} = request.cookies
            await this.authService.logOut(refreshToken);
            response.clearCookie("refreshToken")
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    @UsePipes(new ValidationPipe())
    @Get('refresh')
    async refresh(
        @Req() request: Request,
        @Res({passthrough: true}) response: Response,
    ) {
        try {
            const {refreshToken} = request.cookies
            const data = await this.authService.refreshToken(refreshToken);
            response.cookie('refreshToken', data.tokens.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            return {
                user: new UserResponse(data.user),
                tokens: data.tokens
            };
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    @UsePipes(new ValidationPipe())
    @Get('check-access-token')
    async checkToken(
        @Req() request: Request
    ) {
        try {
            const {authorization} = request.headers
            if (!authorization) {
                return new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED)
            }
            const accessToken = authorization.split(' ')[1]
            if (!accessToken) {
                return new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED)
            }
            const payload = this.tokenService.validateAccessToken(accessToken);
            if (!payload || !("sessionUuid" in payload) || !("userId" in payload)) {
                return  {
                    isValid: false,
                }
            }
            const session = await this.sessionService.getSessionByUuid(payload.sessionUuid)
            if (!session) {
                return  {
                    isValid: false,
                }
            }
            return {
                isValid: true,
            }
        } catch (e) {
            console.log(e);
            return e;
        }
    }
}
