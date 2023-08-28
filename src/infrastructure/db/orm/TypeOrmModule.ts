import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const typeOrmModule = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => {
    return {
      type: config.get<'aurora-postgres'>('TYPEORM_CONNECTION'),
      host: config.get<string>('TYPEORM_HOST'),
      username: config.get<string>('TYPEORM_USERNAME'),
      password: config.get<string>('TYPEORM_PASSWORD'),
      database: config.get<string>('TYPEORM_DATABASE'),
      port: config.get<number>('TYPEORM_PORT'),
      entities: [__dirname + 'dist/**/*.entity{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true,
      logger: 'simple-console',
    };
  },
});
