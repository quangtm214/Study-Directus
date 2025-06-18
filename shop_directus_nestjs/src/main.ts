import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';
import { DirectusExceptionFilter } from 'src/common/filters/directus-exception.filter';
import { DirectusService } from 'src/directus/directus.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());

  const directusService = app.get(DirectusService);
  app.useGlobalFilters(new DirectusExceptionFilter(directusService));

  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  app.useStaticAssets(join(__dirname, '..', 'public'));
  await app.listen(process.env.PORT ?? 9939);
  console.log(`Application is running on: http://localhost:${process.env.PORT ?? 9939}`);
}
bootstrap();
