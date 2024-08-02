import { Module } from '@nestjs/common';
import { EstradosHttpService } from './estrados-http.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [EstradosHttpService, HttpModule],
  imports: [HttpModule],
  exports: [EstradosHttpService],
})
export class EstradosHttpModule {}
