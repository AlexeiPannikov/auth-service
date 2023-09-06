import {SignUpDto} from "../dto/SignUp.dto";
import {User} from "../../../entities/User/User";
import {SignInDto} from "../dto/SignIn.dto";

export interface IAuthService {
    signUp(dto: SignUpDto): Promise<{
        user: User;
    }>;

    signIn(dto: SignInDto): Promise<{
        user: User;
        tokens: { accessToken: string; refreshToken: string };
    }>

    refreshToken(refreshToken: string): Promise<{ user: User, tokens: { accessToken: string; refreshToken: string; } }>

    logOut(sessionUuid: string): Promise<void>
}

export const IAuthService = Symbol("IAuthService")