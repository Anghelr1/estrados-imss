import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { EstradosResponse } from './dto/EstradosResponseDto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EstradosHttpService {
  constructor(private httpService: HttpService) {}

  async getEstrados(
    start: number = 0,
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
      console.log('Error during getting estrados info: ', error);
      throw error;
    }
  }
}
