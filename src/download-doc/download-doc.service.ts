import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import { logger } from 'src/config/logger.config';

@Injectable()
export class DownloadDocService {
  private lastRequestTime: number = 0;
  private readonly cooldownPeriod: number = 5000;

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

        await page.goto(
          'http://notificacionporestrados.imss.gob.mx/estrados-web',
        );

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

        const response = await page.goto(
          'https://example.com/estrados-web/estrados/obtenerDocumentoAdjunto.do',
          { waitUntil: 'networkidle2' },
        );

        if (!response.ok()) {
          throw new Error(`HTTP error! status: ${response.status()}`);
        }

        await this.waitForCooldown();

        const descargarURL =
          'https://example.com/estrados-web/servlet/MostrarArchivoServlet';
        logger.log(`Descargando archivo desde: ${descargarURL}`);
        const fileResponse = await page.goto(descargarURL, {
          waitUntil: 'networkidle2',
        });

        if (!fileResponse.ok()) {
          throw new Error(`HTTP error! status: ${fileResponse.status()}`);
        }

        const buffer = await fileResponse.buffer();
        const fileName = `${fileDocName}_${cveDoctoAdjunto}.pdf`;
        const folderPath = path.join(
          process.cwd(),
          'downloads',
          cveNotificaciones,
        );
        const filePath = path.join(folderPath, fileName);

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
