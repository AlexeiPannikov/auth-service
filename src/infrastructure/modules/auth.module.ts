import { Module } from '@nestjs/common';
import { AuthHttpController } from '../controllers/AuthControllers/AuthHttpController/AuthHttpController';
import { TokenService } from '../../core/services/TokenService/TokenService';
import { EmailActivationService } from '../../core/services/ActivationServices/EmailService/EmailActivationService';
import { UserRepositoryImpl } from '../db/repositories/User/UserRepositoryImpl';
import { IUserRepository } from '../../core/repositories/UserRepository/IUserRepository';
import { UserEntity } from '../db/entities/User/User.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ITokenService } from '../../core/services/TokenService/interface/ITokenService';
import { TokenRepositoryImpl } from '../db/repositories/Token/TokenRepositoryImpl';
import { ITokenRepository } from '../../core/repositories/TokenRepository/ITokenRepository';
import { IActivationService } from '../../core/services/ActivationServices/interfaces/IActivationService';
import { TokenEntity } from '../db/entities/Token/Token.entity';
import { IUserService } from '../../core/services/UserService/interface/IUserService';
import { UserService } from '../../core/services/UserService/UserService';
import { ResponseInterceptor } from '../interceptors/ResponseInterceptor';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, TokenEntity])],
  controllers: [AuthHttpController],
  providers: [
    ResponseInterceptor,
    {
      provide: IUserService,
      useClass: UserService,
    },
    {
      provide: IUserRepository,
      useClass: UserRepositoryImpl,
    },
    {
      provide: ITokenService,
      useClass: TokenService,
    },
    {
      provide: ITokenRepository,
      useClass: TokenRepositoryImpl,
    },
    {
      provide: IActivationService,
      useClass: EmailActivationService,
    },
  ],
})
export class AuthModule {}
