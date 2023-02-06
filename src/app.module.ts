import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AppModel } from './app.model';
import { CommissionModel } from './commission.model';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath:`.env.${process.env.NODE_ENV}`
  })],
  controllers: [AppController],
  providers: [AppService, AppModel, CommissionModel],
})
export class AppModule {}
