import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { AllExceptionsFilter } from './filters/Exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //  Set the global prefix to 'api'
  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Use the AllExceptionsFilter class as the global filter
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

  await app.listen(3000);
}
bootstrap();
