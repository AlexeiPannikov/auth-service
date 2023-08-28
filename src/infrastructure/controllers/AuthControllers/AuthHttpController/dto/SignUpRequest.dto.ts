import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { SignUpDto } from '../../../../../core/services/UserService/dto/SignUpDto';

export class SignUpRequestDto implements SignUpDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  // @IsStrongPassword({minLength: 5, minNumbers: 1, minUppercase: 1, minLowercase: 1, minSymbols: 1})
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
