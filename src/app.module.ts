import {
  MiddlewareConsumer,
  Module,
  NestMiddleware,
  NestModule,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './database/data-source';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { AuthModule } from './modules/auth/auth.module';
import { NextFunction, Request, Response } from 'express';
import { NODE_ENV } from './config/env';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    AuthModule,
    RolesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply().forRoutes('*');

    consumer.apply(LoggerMiddleware).exclude('/api').forRoutes('*');
  }
}

class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (NODE_ENV === 'dev') {
      const requestDate = new Date();

      console.log(`Request: ${req.method.toUpperCase()} ${req.originalUrl}`, {
        body: JSON.stringify(req.body),
      });

      res.on('close', () => {
        const responseDate = new Date();

        const duration = responseDate.getTime() - requestDate.getTime();

        console.log(
          `Response: ${req.method.toUpperCase()} ${req.originalUrl} - ${
            res.statusCode
          }`,
          {
            duration,
            requestDate,
            responseDate,
          },
        );
      });
    }

    next();
  }
}
