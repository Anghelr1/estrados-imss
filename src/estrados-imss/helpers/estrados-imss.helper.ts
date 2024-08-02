import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AaDatum } from 'src/estrados-http/dto/EstradosResponseDto';
import { EstradosImss } from '../entities/EstradosImss';
import { EstradosImssDto } from '../dtos/estrado-imss-create.dto';

export async function saveEstradoImss(
  aaDatum: AaDatum,
  estradosImssRepository: Repository<EstradosImss>,
): Promise<EstradosImss> {
  const logger = new Logger('saveEstradoImss');

  try {
    // Verificar si ya existe un registro con el mismo cveNotificaciones
    const existingEstrado = await estradosImssRepository.findOne({
      where: { cveNotificaciones: aaDatum.cveNotificaciones },
    });

    if (existingEstrado) {
      logger.log(
        `Estrado con cveNotificaciones ${aaDatum.cveNotificaciones} ya existe. No se guardará.`,
      );
      return existingEstrado;
    }

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

    const savedEstrado = await estradosImssRepository.save(estradoImss);
    logger.debug(`Estrado guardado con éxito: ${savedEstrado.id}`);
    return savedEstrado;
  } catch (error) {
    logger.error(
      `Error al guardar estrado: ${aaDatum.cveNotificaciones}`,
      error.stack,
    );
    throw new HttpException(
      `Error al guardar estrado: ${aaDatum.cveNotificaciones}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
