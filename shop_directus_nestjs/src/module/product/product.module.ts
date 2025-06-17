import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { DirectusModule } from 'src/directus/directus.module';
import { ProductGateway } from 'src/module/product/productGateway';

@Module({
    imports: [
        DirectusModule
    ],
    controllers: [ProductController],
    providers: [ProductService, ProductGateway],
    exports: [ProductService, ProductGateway]
})
export class ProductModule { }
