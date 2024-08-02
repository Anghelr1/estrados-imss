import { Controller, Get, UseFilters } from '@nestjs/common';
import { EstradosImssService } from './estrados-imss.service';
import { EstradosImssExceptionFilter } from 'src/filters/estrados-imss-exception.filter';

@Controller({
  path: 'estrados-imss',
  version: '1',
})
@UseFilters(EstradosImssExceptionFilter)
export class EstradosImssController {
  constructor(private readonly estradosImssService: EstradosImssService) {}

  @Get('sync')
  async syncEstradosImss() {
    await this.estradosImssService.getAndSaveAllEstradosImss();
    return { message: 'Synchronization completed' };
  }

  @Get('sync-docs')
  async syncEstradosImssDocs() {
    await this.estradosImssService.downloadAllDocs();
    return { message: 'Documents synchronization completed' };
  }
}
