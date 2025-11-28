import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UrlsModule } from './urls/urls.module';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis-yet';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      useFactory: () => ({
        isGlobal: true,
        store: redisStore,
        host: 'localhost',
        port: 6379,
        ttl: 60*60, // 1 hour
      }),
    }),
    PrismaModule,
     UrlsModule
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
