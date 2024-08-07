import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import { logger } from 'src/config/logger.config';

@Injectable()
export class DownloadDocService {
  private lastRequestTime: number = 0;
  private readonly cooldownPeriod: number = 5000; // 5 segundos de espera entre peticiones

  async descargarArchivo(
    cveDoctoAdjunto: string,
    cveNotificaciones: string,
    fileDocName: string,
  ): Promise<string> {
    const maxRetries = 10;
    for (let i = 0; i < maxRetries; i++) {
      try {
        await this.waitForCooldown();

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Navegar a la página inicial para establecer sesión
        await page.goto('https://example.com/estrados-web/');

        // Interceptar y modificar la solicitud para usar el método POST
        await page.setRequestInterception(true);
        page.on('request', (request) => {
          if (request.url().endsWith('/estrados/obtenerDocumentoAdjunto.do')) {
            request.continue({
              method: 'POST',
              postData: JSON.stringify({
                cveDoctoAdjunto,
                notificacionesDTO: { cveNotificaciones },
              }),
              headers: {
                ...request.headers(),
                'Content-Type': 'application/json',
              },
            });
          } else {
            request.continue();
          }
        });

        // Realizar la solicitud para obtener el documento
        await page.goto(
          'https://example.com/estrados-web/estrados/obtenerDocumentoAdjunto.do',
        );

        // Esperar el cooldown antes de descargar el archivo
        await this.waitForCooldown();

        // Descargar el archivo
        const descargarURL =
          'https://example.com/estrados-web/servlet/MostrarArchivoServlet';
        const response = await page.goto(descargarURL, {
          waitUntil: 'networkidle2',
        });

        const buffer = await response.buffer();
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

        fs.writeFileSync(filePath, buffer);

        logger.log(`Archivo guardado como ${filePath}`);
        await browser.close();
        return filePath;
      } catch (error) {
        logger.error(`Intento ${i + 1} fallido: ${error.message}`);
        if (i === maxRetries - 1) throw error;
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
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
}
