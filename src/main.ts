import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import {SessionService} from "./core/services/SessionService/SessionService";
import {ISessionService} from "./core/services/SessionService/interface/ISessionService";

async function start() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  const configService = app.get(ConfigService);
  const sessionService = app.get(ISessionService)
  const port = configService.get<number>('PORT');
  await app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
  sessionService.runOldSessionsCleaner()
}

start();
