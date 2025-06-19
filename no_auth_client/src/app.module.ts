import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from 'src/module/product/product.module';
import { DirectusModule } from 'src/directus/directus.module';

@Module({
  imports: [
    DirectusModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
