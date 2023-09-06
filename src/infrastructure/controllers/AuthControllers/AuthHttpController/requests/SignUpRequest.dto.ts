import {IsEmail, IsNotEmpty, IsString, IsStrongPassword, MinLength} from 'class-validator';
import {SignUpDto} from "../../../../../core/services/AuthService/dto/SignUp.dto";

export class SignUpRequestDto implements SignUpDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
