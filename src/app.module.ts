import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './infrastructure/modules/auth.module';
import { typeOrmModule } from './infrastructure/db/orm/TypeOrmModule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: './.env' }),
    typeOrmModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
