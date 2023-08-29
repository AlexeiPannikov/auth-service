import {
    Body,
    Controller,
    Get,
    Inject,
    Param,
    Post,
    Res,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import {SignUpRequestDto} from './dto/SignUpRequest.dto';
import {IUserService} from '../../../../core/services/UserService/interface/IUserService';
import {Response} from 'express';
import {ResponseInterceptor} from '../../../interceptors/ResponseInterceptor';
import * as process from 'process';
import {SignInRequestDto} from "./dto/SignInRequest.dto";

@Controller('auth')
@UseInterceptors(ResponseInterceptor)
export class AuthHttpController {
    constructor(
        @Inject(IUserService)
        private readonly userService: IUserService,
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
            delete data.user.password
            return data;
        } catch (e) {
            console.log(e);
            return e;
        }
    }
}
