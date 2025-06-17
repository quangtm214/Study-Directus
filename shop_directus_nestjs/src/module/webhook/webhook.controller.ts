import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ProductGateway } from 'src/module/product/productGateway';

@Controller('webhook')
export class WebhookController {
    constructor(
        @Inject() private readonly productGateway: ProductGateway,
    ) { }

    @Post('product-created')
    async handleProductCreated(@Body() data: any) {
        console.log('Product created webhook received');
        this.productGateway.emitNewProduct(data);
        return { message: 'Product created webhook handled successfully' };
    }
}
