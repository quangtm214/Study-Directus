import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from 'src/module/auth/auth.module';
import { DirectusModule } from 'src/directus/directus.module';
import { ProductModule } from 'src/module/product/product.module';
import { DirectusTokenMiddleware } from 'src/directus/directusTokenMiddleware';
import { WebhookModule } from 'src/module/webhook/webhook.module';
import { RegisterModule } from 'src/module/register/register.module';

@Module({
  imports: [
    DirectusModule,
    AuthModule,
    ProductModule,
    WebhookModule,
    RegisterModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DirectusTokenMiddleware)
      .exclude(
        { path: 'auth/login', method: RequestMethod.POST }, // Loại trừ route login
        { path: 'auth/register', method: RequestMethod.POST } // Loại trừ route register nếu có
      )
      .forRoutes('*'); // Áp dụng cho tất cả các route khác
  }
}
