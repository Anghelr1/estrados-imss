import { Controller, Get } from '@nestjs/common';
import { EstradosImssService } from './estrados-imss.service';

@Controller({
  path: 'estrados-imss',
  version: '1',
})
export class EstradosImssController {
  constructor(private readonly estradosImssService: EstradosImssService) {}

  @Get()
  async saveEstrados() {
    return this.estradosImssService.getEstradosImss();
  }
}
