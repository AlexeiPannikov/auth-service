import { User } from '../../entities/User/User';
import { CreateUserDto } from './dto/CreateUser.dto';

export interface IUserRepository {
  createUser(dto: CreateUserDto): Promise<User>;
  updateUser(user: User): Promise<User>;
  activate(user: User): Promise<User>;
  getUsers(): Promise<User[]>;
  getUserById(id: number): Promise<User>;
  getUserByEmail(email: string): Promise<User>;
  getUserByActivationLink(link: string): Promise<User>;
}

export const IUserRepository = Symbol('IUserRepository');
