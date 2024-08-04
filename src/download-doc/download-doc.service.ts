import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as fs from 'fs';
import * as path from 'path';
import { logger } from 'src/config/logger.config';

@Injectable()
export class DownloadDocService {
  private cookies: string[] = [];
  private lastRequestTime: number = 0;
  private readonly cooldownPeriod: number = 5000; // 5 segundos de espera entre peticiones

  constructor(private httpService: HttpService) {}

  async descargarArchivo(
    cveDoctoAdjunto: string,
    cveNotificaciones: string,
    fileDocName: string,
  ): Promise<string> {
    const maxRetries = 10;
    for (let i = 0; i < maxRetries; i++) {
      try {
        await this.waitForCooldown();
        await this.obtenerCookies();

        const obtenerDocumentoURL =
          '/estrados-web/estrados/obtenerDocumentoAdjunto.do';
        const data = {
          cveDoctoAdjunto,
          notificacionesDTO: { cveNotificaciones },
        };

        await this.waitForCooldown();
        await firstValueFrom(
          this.httpService.post(obtenerDocumentoURL, data, {
            headers: {
              'Content-Type': 'application/json',
              Cookie: this.cookies.join('; '),
            },
          }),
        );

        await this.waitForCooldown();
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
        const folderPath = path.join(
          process.cwd(),
          'downloads',
          cveNotificaciones,
        );
        const filePath = path.join(folderPath, fileName);

        // Crear la carpeta si no existe
        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath, { recursive: true });
        }

        fs.writeFileSync(filePath, response.data);

        logger.log(`Archivo guardado como ${filePath}`);
        this.limpiarCookies();
        return filePath;
      } catch (error) {
        logger.error(`Intento ${i + 1} fallido: ${error.message}`);
        if (i === maxRetries - 1) throw error;
        await new Promise((resolve) => setTimeout(resolve, 5000));
        this.limpiarCookies();
      }
    }
  }

  private async obtenerCookies(): Promise<void> {
    try {
      logger.log('Intentando obtener cookies...');
      const response = await firstValueFrom(
        this.httpService.get('/estrados-web/', {
          maxRedirects: 5,
        }),
      );
      this.cookies = response.headers['set-cookie'] || [];
      logger.log(`Cookies obtenidas: ${this.cookies.join('; ')}`);
    } catch (error) {
      logger.error(`Error al obtener cookies: ${error.message}`);
      throw error;
    }
  }

  private async waitForCooldown(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.cooldownPeriod) {
      const waitTime = this.cooldownPeriod - timeSinceLastRequest;
      logger.log(`Esperando ${waitTime}ms antes de la siguiente petición`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
    this.lastRequestTime = Date.now();
  }

  private limpiarCookies(): void {
    logger.log('Limpiando cookies');
    this.cookies = [];
  }
}
