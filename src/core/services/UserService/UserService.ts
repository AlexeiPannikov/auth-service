import {IUserRepository} from '../../repositories/UserRepository/IUserRepository';
import {HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {v4} from 'uuid';
import {IUserService} from './interface/IUserService';
import {ITokenService} from '../TokenService/interface/ITokenService';
import {IActivationService} from '../ActivationServices/interfaces/IActivationService';
import * as process from 'process';
import {SignUpDto} from "./dto/SignUp.dto";
import {SignInDto} from './dto/SignIn.dto';

@Injectable()
export class UserService implements IUserService {
    constructor(
        @Inject(IUserRepository)
        private readonly userRepository: IUserRepository,
        @Inject(IActivationService)
        private readonly activationService: IActivationService,
        @Inject(ITokenService)
        private readonly tokenService: ITokenService,
    ) {
    }

    async signIn(dto: SignInDto) {
        const user = await this.userRepository.getUserByEmail(dto.email)
        if (!user) {
            throw new HttpException(
                `User wit this email is not exist`,
                HttpStatus.BAD_REQUEST
            )
        }
        const isEqualPass = bcrypt.compare(dto.password, user.password)
        if (!isEqualPass) {
            throw new HttpException(
                `Wrong password`,
                HttpStatus.BAD_REQUEST
            )
        }
        const tokens = this.tokenService.generateTokens({id: user.id});
        console.log(tokens)
        await this.tokenService.saveRefreshToken({
            userId: user.id,
            refreshToken: tokens.refreshToken,
        });
        return {
            user,
            tokens,
        };
    }

    async signUp(dto: SignUpDto) {
        const {password, email} = dto;
        const candidate = await this.userRepository.getUserByEmail(email);
        if (candidate) {
            throw new HttpException(
                `User with email ${dto.email} already exist`,
                HttpStatus.BAD_REQUEST,
            );
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = v4();
        const user = await this.userRepository.createUser({
            ...dto,
            password: hashPassword,
            activationLink,
        });
        await this.activationService.sendActivationNotify({
            to: email,
            link: `${process.env.API_URL}/auth/activate/${activationLink}`,
        });
        const tokens = this.tokenService.generateTokens({id: user.id});
        await this.tokenService.saveRefreshToken({
            userId: user.id,
            refreshToken: tokens.refreshToken,
        });
        return {
            user,
            tokens,
        };
    }

    async activate(activationLink: string) {
        const user = await this.userRepository.getUserByActivationLink(
            activationLink,
        );
        if (!user) {
            throw new HttpException(`User is not exist`, HttpStatus.BAD_REQUEST);
        }
        user.isActivated = true;
        return await this.userRepository.updateUser(user);
    }
}
