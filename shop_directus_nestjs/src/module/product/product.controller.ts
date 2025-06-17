import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './product.dto';

@Controller('product')
export class ProductController {
    constructor(
        @Inject() private readonly productService: ProductService
    ) { }

    @Get()
    async getProducts() {
        return this.productService.getProducts();
    }

    @Post()
    async postProduct(@Body() productData: CreateProductDto) {
        return this.productService.postProduct(productData);
    }
}