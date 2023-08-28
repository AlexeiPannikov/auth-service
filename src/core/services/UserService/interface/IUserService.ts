import { User } from '../../../entities/User/User';
import { SignUpDto } from '../dto/SignUpDto';

export interface IUserService {
  signUp(dto: SignUpDto): Promise<{
    user: User;
    tokens: { accessToken: string; refreshToken: string };
  }>;
  activate(activationLink: string): Promise<boolean>;
}

export const IUserService = Symbol('IUserService');
