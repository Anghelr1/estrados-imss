import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EstradosImss } from './entities/EstradosImss';
import { Repository } from 'typeorm';
import { EstradosHttpService } from '../estrados-http/estrados-http.service';
import { saveEstradoImss } from './helpers/estrados-imss.helper';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class EstradosImssService {
  private readonly logger = new Logger(EstradosImssService.name);

  constructor(
    @InjectRepository(EstradosImss)
    private readonly estradosImssRepository: Repository<EstradosImss>,
    private readonly estradosHttpService: EstradosHttpService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM, {
    timeZone: 'America/Mexico_City', // Ajusta esto a tu zona horaria
  })
  async scheduledGetAndSaveAllEstradosImss() {
    this.logger.log(
      'Iniciando tarea programada de sincronización de estrados IMSS',
    );
    await this.getAndSaveAllEstradosImss();
  }

  async getAndSaveAllEstradosImss(): Promise<void> {
    this.logger.log('Iniciando sincronización de estrados IMSS');
    try {
      let start = 0;
      const length = 1000;
      let totalRecords = 0;
      let processedRecords = 0;
      let batchNumber = 0;

      do {
        batchNumber++;
        this.logger.log(
          `Iniciando procesamiento del lote ${batchNumber}. Registros procesados: ${processedRecords}`,
        );

        await this.sleep(2000);
        this.logger.debug(
          `Pausa de 2 segundos completada antes del lote ${batchNumber}`,
        );

        const { aaData, iTotalDisplayRecords } =
          await this.estradosHttpService.getEstrados(start, length);
        this.logger.log(
          `Datos recibidos para el lote ${batchNumber}. Registros en este lote: ${aaData.length}`,
        );

        if (totalRecords === 0) {
          totalRecords = iTotalDisplayRecords;
          this.logger.log(`Total de registros a procesar: ${totalRecords}`);
        }

        const estradosPromises = aaData.map((aaDatum) =>
          saveEstradoImss(aaDatum, this.estradosImssRepository),
        );
        await Promise.all(estradosPromises);

        processedRecords += aaData.length;
        start += length;

        this.logger.log(
          `Lote ${batchNumber} completado. Total procesado: ${processedRecords} de ${totalRecords} registros`,
        );
      } while (processedRecords < totalRecords);

      this.logger.log('Sincronización de estrados IMSS completada con éxito');
    } catch (error) {
      this.logger.error(
        'Error al obtener y guardar los estrados del IMSS',
        error.stack,
      );
      throw new HttpException(
        'Error al sincronizar estrados IMSS',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
