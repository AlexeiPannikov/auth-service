import {MiddlewareConsumer, Module} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './infrastructure/modules/auth.module';
import { typeOrmModule } from './infrastructure/db/orm/TypeOrmModule';
import {CheckAuthMiddleware} from "./infrastructure/middlewares/CheckAuth.middleware";
import {ITokenService} from "./core/services/TokenService/interface/ITokenService";
import {TokenService} from "./core/services/TokenService/TokenService";
import {ITokenRepository} from "./core/repositories/TokenRepository/ITokenRepository";
import {TokenRepositoryImpl} from "./infrastructure/db/repositories/Token/TokenRepositoryImpl";
import {IUserRepository} from "./core/repositories/UserRepository/IUserRepository";
import {UserRepositoryImpl} from "./infrastructure/db/repositories/User/UserRepositoryImpl";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "./infrastructure/db/entities/User/User.entity";
import {TokenEntity} from "./infrastructure/db/entities/Token/Token.entity";
import {IUserService} from "./core/services/UserService/interface/IUserService";
import {UserService} from "./core/services/UserService/UserService";
import {IActivationService} from "./core/services/ActivationServices/interfaces/IActivationService";
import {EmailActivationService} from "./core/services/ActivationServices/EmailService/EmailActivationService";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: './.env' }),
    typeOrmModule,
    TypeOrmModule.forFeature([UserEntity, TokenEntity]),
    AuthModule,
  ],
  controllers: [],
  providers: [
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
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
        .apply(CheckAuthMiddleware)
        .forRoutes('auth/log-out', 'auth/get-all-users');
  }
}
