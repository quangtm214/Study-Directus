import { Body, Controller, Get, Inject, Post, Render, Res } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './product.dto';
import { Response } from 'express';

@Controller('product')
export class ProductController {
    constructor(
        @Inject() private readonly productService: ProductService
    ) { }

    @Get()
    async getProducts(@Res() res: Response) {
        const result = await this.productService.getProducts();
        return res.render('product', { products: result });
    }

    @Post()
    async postProduct(@Body() productData: CreateProductDto) {
        return this.productService.postProduct(productData);
    }
}