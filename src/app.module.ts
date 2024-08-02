import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstradosImssModule } from './estrados-imss/estrados-imss.module';
import { EstradosHttpModule } from './estrados-http/estrados-http.module';
import * as process from 'node:process';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DB_HOSTNAME,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      options: { encrypt: false },
      autoLoadEntities: true,
      synchronize: true,
    }),
    EstradosImssModule,
    EstradosHttpModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
