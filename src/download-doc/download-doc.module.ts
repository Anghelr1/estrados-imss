import { Module } from '@nestjs/common';
import { DownloadDocService } from './download-doc.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [DownloadDocService],
  imports: [
    HttpModule.register({
      baseURL: 'http://notificacionporestrados.imss.gob.mx',
      withCredentials: true,
    }),
  ],
  exports: [DownloadDocService],
})
export class DownloadDocModule {}
