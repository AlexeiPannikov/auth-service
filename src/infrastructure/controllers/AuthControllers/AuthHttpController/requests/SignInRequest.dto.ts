import {IsEmail, IsNotEmpty, IsString} from 'class-validator';
import {SignInDto} from "../../../../../core/services/AuthService/dto/SignIn.dto";

export class SignInRequestDto implements SignInDto {

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;
}
