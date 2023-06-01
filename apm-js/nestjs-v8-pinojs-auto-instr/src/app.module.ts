import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from './logger/logger.module'; // added to do logging with pino

@Module({
  imports: [LoggerModule], // added to do logging with pino
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
