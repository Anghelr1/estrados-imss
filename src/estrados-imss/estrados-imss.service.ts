import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EstradosImss } from './entities/EstradosImss';
import { Repository } from 'typeorm';
import { AaDatum } from 'src/estrados-http/dto/EstradosResponseDto';
import { EstradosImssDto } from './dtos/estrado-imss-create.dto';
import { EstradosHttpService } from '../estrados-http/estrados-http.service';

@Injectable()
export class EstradosImssService {
  private readonly logger = new Logger(EstradosImssService.name);

  constructor(
    @InjectRepository(EstradosImss)
    private readonly estradosImssRepository: Repository<EstradosImss>,
    private readonly estradosHttpService: EstradosHttpService,
  ) {}

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
          this.saveEstradoImss(aaDatum),
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

  private async saveEstradoImss(aaDatum: AaDatum): Promise<EstradosImss> {
    try {
      const estradoImss = new EstradosImssDto();
      estradoImss.cveNotificaciones = aaDatum.cveNotificaciones;
      estradoImss.registroPatronal = aaDatum.registroPatronal;
      estradoImss.razonSocial = aaDatum.razonSocial;
      estradoImss.desDomicilio = aaDatum.desDomicilio;
      estradoImss.fecPublicacion = new Date(aaDatum.fecPublicacion);
      estradoImss.fecInicioPublicacion = new Date(aaDatum.fecInicioPublicacion);
      estradoImss.fecFinPublicacion = new Date(aaDatum.fecFinPublicacion);
      estradoImss.fecRetiroPublicacion = new Date(aaDatum.fecRetiroPublicacion);
      estradoImss.fecRegistro = aaDatum.fecRegistro;
      estradoImss.fecPublicacionCadena = aaDatum.fecPublicacionCadena;

      if (
        aaDatum.listDocumentosAdjuntosDTOs &&
        aaDatum.listDocumentosAdjuntosDTOs.length > 0
      ) {
        estradoImss.cveDoctoAdjuntoAcuerdo =
          aaDatum.listDocumentosAdjuntosDTOs[0].cveDoctoAdjunto;
        estradoImss.desNumOficioAcuerdo =
          aaDatum.listDocumentosAdjuntosDTOs[0].desNumOficio;
        estradoImss.desNombreArchivoAcuerdo =
          aaDatum.listDocumentosAdjuntosDTOs[0].desNombreArchivo;
        estradoImss.desTipoAdjuntoAcuerdo =
          aaDatum.listDocumentosAdjuntosDTOs[0].tipoAdjuntoDTO.desTipoAdjunto;
      }

      if (
        aaDatum.listDocumentosAdjuntosDTOs &&
        aaDatum.listDocumentosAdjuntosDTOs.length > 1
      ) {
        estradoImss.cveDoctoAdjuntoDocumento =
          aaDatum.listDocumentosAdjuntosDTOs[1].cveDoctoAdjunto;
        estradoImss.desNumOficioDocumento =
          aaDatum.listDocumentosAdjuntosDTOs[1].desNumOficio;
        estradoImss.desNombreArchivoDocumento =
          aaDatum.listDocumentosAdjuntosDTOs[1].desNombreArchivo;
        estradoImss.desTipoAdjuntoDocumento =
          aaDatum.listDocumentosAdjuntosDTOs[1].tipoAdjuntoDTO.desTipoAdjunto;
      }

      estradoImss.desTipodocumento = aaDatum.tipodocumentoDTO.desTipodocumento;
      estradoImss.desProceso = aaDatum.tipodocumentoDTO.procesoDTO.desProceso;
      estradoImss.fechaRegistro = new Date();

      const savedEstrado = await this.estradosImssRepository.save(estradoImss);
      this.logger.debug(`Estrado guardado con éxito: ${savedEstrado.id}`);
      return savedEstrado;
    } catch (error) {
      this.logger.error(
        `Error al guardar estrado: ${aaDatum.cveNotificaciones}`,
        error.stack,
      );
      throw new HttpException(
        `Error al guardar estrado: ${aaDatum.cveNotificaciones}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
