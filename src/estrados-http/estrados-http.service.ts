import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { EstradosResponse } from './dto/EstradosResponseDto';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class EstradosHttpService {
  private readonly logger = new Logger(EstradosHttpService.name);
  private readonly maxRetries = 10;
  private readonly retryDelay = 5000; // 5 segundos
  private lastRequestTime = 0;
  private readonly cooldownPeriod = 2000; // 2 segundos

  constructor(private httpService: HttpService) {}

  async getEstrados(
    start: number = 0,
    length: number,
  ): Promise<EstradosResponse> {
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        await this.waitForCooldown();
        return await this.makeRequest(start, length);
      } catch (error) {
        if (attempt === this.maxRetries) {
          this.logger.error(
            `Error al obtener estrados después de ${this.maxRetries} intentos: ${error.message}`,
          );
          throw error;
        }
        this.logger.warn(
          `Intento ${attempt} fallido. Reintentando en ${this.retryDelay / 1000} segundos...`,
        );
        await this.sleep(this.retryDelay);
      }
    }
  }

  private async makeRequest(
    start: number,
    length: number,
  ): Promise<EstradosResponse> {
    const baseUrl =
      'http://notificacionporestrados.imss.gob.mx/estrados-web/estrados/consultaExternaPaginada.do';

    const params = new URLSearchParams({
      sEcho: '4',
      iColumns: '5',
      sColumns: '',
      iDisplayStart: start.toString(),
      iDisplayLength: length.toString(),
      mDataProp_0: 'razonSocial',
      mDataProp_1: '1',
      mDataProp_2: 'tipodocumentoDTO.desTipodocumento',
      mDataProp_3: 'fecPublicacionCadena',
      mDataProp_4: '4',
      sSearch: '',
      bRegex: 'false',
      sSearch_0: '',
      bRegex_0: 'false',
      bSearchable_0: 'true',
      sSearch_1: '',
      bRegex_1: 'false',
      bSearchable_1: 'true',
      sSearch_2: '',
      bRegex_2: 'false',
      bSearchable_2: 'true',
      sSearch_3: '',
      bRegex_3: 'false',
      bSearchable_3: 'true',
      sSearch_4: '',
      bRegex_4: 'false',
      bSearchable_4: 'true',
      iSortingCols: '1',
      iSortCol_0: '3',
      sSortDir_0: 'desc',
      bSortable_0: 'true',
      bSortable_1: 'false',
      bSortable_2: 'false',
      bSortable_3: 'true',
      bSortable_4: 'false',
    });

    try {
      const response = await firstValueFrom(
        this.httpService.get<EstradosResponse>(
          `${baseUrl}?${params.toString()}`,
        ),
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(`Error de red: ${error.message}`);
        if (error.response) {
          this.logger.error(`Estado de respuesta: ${error.response.status}`);
          this.logger.error(
            `Datos de respuesta: ${JSON.stringify(error.response.data)}`,
          );
        }
      } else {
        this.logger.error(`Error desconocido: ${error.message}`);
      }
      throw error;
    }
  }

  private async waitForCooldown(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.cooldownPeriod) {
      const waitTime = this.cooldownPeriod - timeSinceLastRequest;
      this.logger.log(`Esperando ${waitTime}ms antes de la siguiente petición`);
      await this.sleep(waitTime);
    }
    this.lastRequestTime = Date.now();
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
