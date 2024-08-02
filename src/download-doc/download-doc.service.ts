import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as fs from 'fs';
import * as path from 'path';
import { logger } from 'src/config/logger.config';

@Injectable()
export class DownloadDocService {
  private cookies: string[] = [];

  constructor(private httpService: HttpService) {}

  async descargarArchivo(
    cveDoctoAdjunto: string,
    cveNotificaciones: string,
    fileDocName: string,
  ): Promise<string> {
    try {
      await this.obtenerCookies();

      const obtenerDocumentoURL =
        '/estrados-web/estrados/obtenerDocumentoAdjunto.do';
      const data = {
        cveDoctoAdjunto,
        notificacionesDTO: { cveNotificaciones },
      };

      await firstValueFrom(
        this.httpService.post(obtenerDocumentoURL, data, {
          headers: {
            'Content-Type': 'application/json',
            Cookie: this.cookies.join('; '),
          },
        }),
      );

      const descargarURL = '/estrados-web/servlet/MostrarArchivoServlet';
      const response = await firstValueFrom(
        this.httpService.get(descargarURL, {
          responseType: 'arraybuffer',
          headers: {
            Cookie: this.cookies.join('; '),
          },
        }),
      );

      const fileName = `${fileDocName}_${cveDoctoAdjunto}.pdf`;
      const filePath = path.join(process.cwd(), 'downloads', fileName);
      fs.writeFileSync(filePath, response.data);

      logger.log(`Archivo guardado como ${filePath}`);
      return filePath;
    } catch (error) {
      logger.error(`Error al descargar el archivo: ${error.message}`);
      if (error.response) {
        logger.error(`Estado de la respuesta: ${error.response.status}`);
        logger.error(
          `Cabeceras de la respuesta: ${JSON.stringify(error.response.headers)}`,
        );
        logger.error(`Datos de la respuesta: ${error.response.data}`);
      }
      throw error;
    }
  }

  private async obtenerCookies(): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.httpService.get('/estrados-web/', {
          maxRedirects: 5,
        }),
      );
      this.cookies = response.headers['set-cookie'] || [];
    } catch (error) {
      logger.error(`Error al obtener cookies: ${error.message}`);
      throw error;
    }
  }
}
