import {
    Body,
    Controller,
    Get, HttpException, HttpStatus,
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
import {UserResponse} from "./responses/UserResponse";

@Controller('auth')
@UseInterceptors(ResponseInterceptor)
export class AuthHttpController {
    constructor(
        @Inject(IUserService)
        private readonly userService: IUserService,
        @Inject(ITokenService)
        private readonly tokenService: ITokenService,
    ) {
    }

    @UsePipes(new ValidationPipe())
    @Post('sign-up')
    async signUp(
        @Body() body: SignUpRequestDto,
        @Res({passthrough: true}) response: Response,
    ) {
        try {
            const data = await this.userService.signUp(body);
            response.cookie('refreshToken', data.tokens.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            delete data.user.password
            return data;
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    @UsePipes(new ValidationPipe())
    @Get('activate/:link')
    async activate(@Param('link') link: string, @Res() response: Response) {
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
            const data = await this.userService.signIn(body);
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
    ) {
        try {
            const {refreshToken} = request.cookies
            await this.userService.logOut(refreshToken);
            request.cookies.clearCookie("refreshToken")
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
            const data = await this.tokenService.refreshToken(refreshToken);
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
    @Get('get-all-users')
    async getAllUsers() {
        try {
            const users = await this.userService.getAllUsers();
            return {
                users: users.map(user => new UserResponse(user))
            }
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    @UsePipes(new ValidationPipe())
    @Get('check-token')
    checkToken(
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
            const userData = this.tokenService.validateAccessToken(accessToken);
            if (userData) {
                return {
                    isValid: true,
                }
            }
            return {
                isValid: false,
            }
        } catch (e) {
            console.log(e);
            return e;
        }
    }
}
