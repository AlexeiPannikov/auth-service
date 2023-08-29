import {User} from '../../../entities/User/User';
import {SignUpDto} from "../dto/SignUp.dto";
import {SignInDto} from "../dto/SignIn.dto";

export interface IUserService {
    signUp(dto: SignUpDto): Promise<{
        user: User;
        tokens: { accessToken: string; refreshToken: string };
    }>;

    activate(activationLink: string): Promise<User>;

    signIn(dto: SignInDto): Promise<{
        user: User;
        tokens: { accessToken: string; refreshToken: string };
    }>
}

export const IUserService = Symbol('IUserService');
