import {IUserRepository} from '../../repositories/UserRepository/IUserRepository';
import {HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {v4} from 'uuid';
import {IUserService} from './interface/IUserService';
import {IActivationService} from '../ActivationServices/interfaces/IActivationService';
import {SignUpDto} from "../AuthService/dto/SignUp.dto";
import {User} from "../../entities/User/User";
import * as process from "process";

@Injectable()
export class UserService implements IUserService {
    constructor(
        @Inject(IUserRepository)
        private readonly userRepository: IUserRepository,
        @Inject(IActivationService)
        private readonly activationService: IActivationService,
    ) {
    }

    async createUser(dto: SignUpDto) {
        const {password, email} = dto;
        const candidate = await this.userRepository.getUserByEmail(email);
        if (candidate) {
            throw new HttpException(
                `User with email ${dto.email} already exist`,
                HttpStatus.BAD_REQUEST,
            );
        }
        const salt = await bcrypt.genSalt(3)
        const hashPassword = await bcrypt.hash(password, salt);
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
        return user
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

    getAllUsers(): Promise<User[]> {
        return this.userRepository.getUsers()
    }

    async getUserByEmail(email: string): Promise<User> {
        const user = await this.userRepository.getUserByEmail(email)
        if (!user) {
            throw new HttpException(
                `User with this email is not exist`,
                HttpStatus.BAD_REQUEST
            )
        }
        return user
    }
}
