import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EstradosImss } from './entities/EstradosImss';
import { Repository } from 'typeorm';
import { AaDatum } from 'src/estrados-http/dto/EstradosResponseDto';
import { EstradosImssDto } from './dtos/estrado-imss-create.dto';
import { EstradosHttpService } from '../estrados-http/estrados-http.service';

@Injectable()
export class EstradosImssService {
  constructor(
    @InjectRepository(EstradosImss)
    private readonly estradosImssRepository: Repository<EstradosImss>,
    private readonly estradosHttpService: EstradosHttpService,
  ) {}

  async getEstradosImss(): Promise<EstradosImss[]> {
    try {
      const { aaData } = await this.estradosHttpService.getEstrados(0, 10);

      const estradosImss = aaData.map((aaDatum) =>
        this.saveEstradoImss(aaDatum),
      );

      return Promise.all(estradosImss);
    } catch (error) {
      console.error(error);
      throw new Error('Error al obtener los estrados del IMSS');
    }
  }

  private saveEstradoImss(aaDatum: AaDatum) {
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
    estradoImss.cveDoctoAdjuntoAcuerdo =
      aaDatum.listDocumentosAdjuntosDTOs[0].cveDoctoAdjunto;
    estradoImss.desNumOficioAcuerdo =
      aaDatum.listDocumentosAdjuntosDTOs[0].desNumOficio;
    estradoImss.desNombreArchivoAcuerdo =
      aaDatum.listDocumentosAdjuntosDTOs[0].desNombreArchivo;
    estradoImss.desTipoAdjuntoAcuerdo =
      aaDatum.listDocumentosAdjuntosDTOs[0].tipoAdjuntoDTO.desTipoAdjunto;
    estradoImss.cveDoctoAdjuntoDocumento =
      aaDatum.listDocumentosAdjuntosDTOs[1].cveDoctoAdjunto;
    estradoImss.desNumOficioDocumento =
      aaDatum.listDocumentosAdjuntosDTOs[1].desNumOficio;
    estradoImss.desNombreArchivoDocumento =
      aaDatum.listDocumentosAdjuntosDTOs[1].desNombreArchivo;
    estradoImss.desTipoAdjuntoDocumento =
      aaDatum.listDocumentosAdjuntosDTOs[1].tipoAdjuntoDTO.desTipoAdjunto;
    estradoImss.desTipodocumento = aaDatum.tipodocumentoDTO.desTipodocumento;
    estradoImss.desProceso = aaDatum.tipodocumentoDTO.procesoDTO.desProceso;
    estradoImss.fechaRegistro = new Date();

    return this.estradosImssRepository.save(estradoImss);
  }
}
