import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { ProductModule } from 'src/module/product/product.module';

@Module({
  imports: [ProductModule],
  controllers: [WebhookController],
  providers: [WebhookService]
})
export class WebhookModule { }
