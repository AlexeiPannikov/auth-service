import { IUserRepository } from '../../../../core/repositories/UserRepository/IUserRepository';
import { User } from '../../../../core/entities/User/User';
import { CreateUserDto } from '../../../../core/repositories/UserRepository/dto/CreateUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/User/User.entity';
import { Repository } from 'typeorm';
import { UserMappers } from '../../mappers/User/UserMappers';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepositoryImpl implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const userEntity = UserMappers.toEntity(dto);
    const user = await this.userRepository.save(userEntity);
    return UserMappers.toDomain(user);
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      return UserMappers.toDomain(user);
    }
    return null;
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (user) {
      return UserMappers.toDomain(user);
    }
    return null;
  }

  async getUsers(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users.map((user) => UserMappers.toDomain(user));
  }

  async activate(user: User): Promise<User> {
    const entity = UserMappers.toEntity(user);
    entity.isActivated = true;
    await this.userRepository.update({ id: user.id }, entity);
    user.isActivated = true;
    return user;
  }

  async getUserByActivationLink(link: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ activationLink: link });
    if (user) {
      return UserMappers.toDomain(user);
    }
  }

  async updateUser(user: User): Promise<User> {
    const entity = UserMappers.toEntity(user);
    await this.userRepository.update({ id: user.id }, entity);
    return user;
  }
}
