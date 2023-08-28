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
import { SignUpRequestDto } from './dto/SignUpRequest.dto';
import { IUserService } from '../../../../core/services/UserService/interface/IUserService';
import { Response } from 'express';
import { ResponseInterceptor } from '../../../interceptors/ResponseInterceptor';

@Controller('auth')
@UseInterceptors(ResponseInterceptor)
export class AuthHttpController {
  constructor(
    @Inject(IUserService)
    private readonly userService: IUserService,
  ) {}

  @UsePipes(new ValidationPipe())
  @Post('sign-up')
  async signUp(
    @Body() body: SignUpRequestDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const data = await this.userService.signUp(body);
      response.cookie('refreshToken', data.tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return data;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  @UsePipes(new ValidationPipe())
  @Get('activate/:link')
  async activate(@Param('link') link: string) {
    try {
      return await this.userService.activate(link);
    } catch (e) {
      console.log(e);
      return e;
    }
  }
}
