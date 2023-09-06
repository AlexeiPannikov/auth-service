import {MiddlewareConsumer, Module} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './infrastructure/modules/auth.module';
import { typeOrmModule } from './infrastructure/db/orm/TypeOrmModule';
import {CheckAuthMiddleware} from "./infrastructure/middlewares/CheckAuth.middleware";
import {ITokenService} from "./core/services/TokenService/interface/ITokenService";
import {TokenService} from "./core/services/TokenService/TokenService";
import {IUserRepository} from "./core/repositories/UserRepository/IUserRepository";
import {UserRepositoryImpl} from "./infrastructure/db/repositories/User/UserRepositoryImpl";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "./infrastructure/db/entities/User/User.entity";
import {IUserService} from "./core/services/UserService/interface/IUserService";
import {UserService} from "./core/services/UserService/UserService";
import {IActivationService} from "./core/services/ActivationServices/interfaces/IActivationService";
import {EmailActivationService} from "./core/services/ActivationServices/EmailService/EmailActivationService";
import {ISessionRepository} from "./core/repositories/SessionRepository/ISessionRepository";
import {SessionRepositoryImpl} from "./infrastructure/db/repositories/Session/SessionRepositoryImpl";
import {ISessionService} from "./core/services/SessionService/interface/ISessionService";
import {SessionService} from "./core/services/SessionService/SessionService";
import {SessionEntity} from "./infrastructure/db/entities/Session/Session.entity";
import {IAuthService} from "./core/services/AuthService/interface/IAuthService";
import {AuthService} from "./core/services/AuthService/AuthService";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: './.env' }),
    typeOrmModule,
    TypeOrmModule.forFeature([UserEntity, SessionEntity]),
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
      provide: IAuthService,
      useClass: AuthService,
    },
    {
      provide: IActivationService,
      useClass: EmailActivationService,
    },
    {
      provide: ISessionRepository,
      useClass: SessionRepositoryImpl,
    },
    {
      provide: ISessionService,
      useClass: SessionService,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
        .apply(CheckAuthMiddleware)
        .forRoutes('auth/log-out', 'users/get-all-users');
  }
}
