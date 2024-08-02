import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstradosImss } from './entities/EstradosImss';
import { EstradosImssService } from './estrados-imss.service';
import { EstradosHttpModule } from 'src/estrados-http/estrados-http.module';
import { EstradosImssController } from './estrados-imss.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EstradosImss]), EstradosHttpModule],
  providers: [EstradosImssService],
  controllers: [EstradosImssController],
})
export class EstradosImssModule {
  constructor() {}
}
