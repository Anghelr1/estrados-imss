import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EstradosImss } from './entities/EstradosImss';
import { Repository } from 'typeorm';
import { EstradosHttpService } from '../estrados-http/estrados-http.service';
import { saveEstradoImss } from './helpers/estrados-imss.helper';
import { Cron, CronExpression } from '@nestjs/schedule';
import { logger } from 'src/config/logger.config';
import { DownloadDocService } from '../download-doc/download-doc.service';

@Injectable()
export class EstradosImssService {
  constructor(
    @InjectRepository(EstradosImss)
    private readonly estradosImssRepository: Repository<EstradosImss>,
    private readonly estradosHttpService: EstradosHttpService,
    private readonly downloadDocService: DownloadDocService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM, {
    timeZone: 'America/Mexico_City',
  })
  async scheduledGetAndSaveAllEstradosImss() {
    logger.log('Iniciando tarea programada de sincronización de estrados IMSS');
    await this.getAndSaveAllEstradosImss();
    await this.downloadAllDocs();
  }

  async getAndSaveAllEstradosImss(): Promise<void> {
    logger.log('Iniciando sincronización de estrados IMSS');
    try {
      let start = 0;
      const length = 1000;
      let totalRecords = 0;
      let processedRecords = 0;
      let batchNumber = 0;

      do {
        batchNumber++;
        logger.log(
          `Iniciando procesamiento del lote ${batchNumber}. Registros procesados: ${processedRecords}`,
        );

        await this.sleep(2000);
        logger.debug(
          `Pausa de 2 segundos completada antes del lote ${batchNumber}`,
        );

        const { aaData, iTotalDisplayRecords } =
          await this.estradosHttpService.getEstrados(start, length);
        logger.log(
          `Datos recibidos para el lote ${batchNumber}. Registros en este lote: ${aaData.length}`,
        );

        if (totalRecords === 0) {
          totalRecords = iTotalDisplayRecords;
          logger.log(`Total de registros a procesar: ${totalRecords}`);
        }

        const estradosPromises = aaData.map((aaDatum) =>
          saveEstradoImss(aaDatum, this.estradosImssRepository),
        );
        await Promise.all(estradosPromises);

        processedRecords += aaData.length;
        start += length;

        logger.log(
          `Lote ${batchNumber} completado. Total procesado: ${processedRecords} de ${totalRecords} registros`,
        );
      } while (processedRecords < totalRecords);

      logger.log('Sincronización de estrados IMSS completada con éxito');
    } catch (error) {
      logger.error(
        'Error al obtener y guardar los estrados del IMSS',
        error.stack,
      );
      throw new HttpException(
        'Error al sincronizar estrados IMSS',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async downloadAllDocs(): Promise<void> {
    try {
      const estrados = await this.estradosImssRepository.find();

      for (const estrado of estrados) {
        if (estrado.cveDoctoAdjuntoAcuerdo && !estrado.rutaArchivoAcuerdo) {
          try {
            await this.sleep(3000);
            const filePath = await this.downloadDocService.descargarArchivo(
              estrado.cveDoctoAdjuntoAcuerdo.toString(),
              estrado.cveNotificaciones.toString(),
              'acuerdo',
            );
            logger.log(
              `Archivo de acuerdo descargado para estrado ${estrado.id}: ${filePath}`,
            );

            estrado.rutaArchivoAcuerdo = filePath;
            await this.estradosImssRepository.save(estrado);
          } catch (error) {
            logger.error(
              `Error al descargar archivo de acuerdo para estrado ${estrado.id}: ${error.message}`,
            );
          }
        } else if (estrado.rutaArchivoAcuerdo) {
          logger.log(
            `Archivo de acuerdo ya existe para estrado ${estrado.id}: ${estrado.rutaArchivoAcuerdo}`,
          );
        }

        if (estrado.cveDoctoAdjuntoDocumento && !estrado.rutaArchivoDocumento) {
          try {
            await this.sleep(3000);
            const filePath = await this.downloadDocService.descargarArchivo(
              estrado.cveDoctoAdjuntoDocumento.toString(),
              estrado.cveNotificaciones.toString(),
              'documento',
            );
            logger.log(
              `Archivo de documento descargado para estrado ${estrado.id}: ${filePath}`,
            );

            estrado.rutaArchivoDocumento = filePath;
            await this.estradosImssRepository.save(estrado);
          } catch (error) {
            logger.error(
              `Error al descargar archivo de documento para estrado ${estrado.id}: ${error.message}`,
            );
          }
        } else if (estrado.rutaArchivoDocumento) {
          logger.log(
            `Archivo de documento ya existe para estrado ${estrado.id}: ${estrado.rutaArchivoDocumento}`,
          );
        }
      }

      logger.log('Descarga de archivos completada');
    } catch (error) {
      logger.error('Error al descargar archivos de estrados', error.stack);
      throw new HttpException(
        'Error al descargar archivos de estrados',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
