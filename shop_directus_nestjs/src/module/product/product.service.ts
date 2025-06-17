import { createItem, createItems, readItems, RegularCollections } from '@directus/sdk';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { DirectusService } from 'src/directus/directus.service';
import { product, Schema } from 'src/directus/schemas';
import { CreateProductDto } from 'src/module/product/product.dto';

// Define the product interface based on your schema


@Injectable()
export class ProductService {
    constructor(
        @Inject() private readonly directusService: DirectusService,
    ) { }

    async getProducts() {
        const client = this.directusService.getClient();
        return await client.request(
            readItems('product', {})
        )
    }

    async postProduct(product: CreateProductDto) {
        try {
            const client = this.directusService.getClient();
            return await client.request(
                createItems('product', [product], {})
            )
        }
        catch (error) {
            if (error?.errors) {
                const firstError = error.errors[0];
                throw new HttpException(
                    {
                        message: firstError.message || 'Directus error',
                        code: firstError.extensions?.code || 'UNKNOWN',
                        detail: firstError.extensions || null,
                    },
                    HttpStatus.BAD_REQUEST,
                );
            }

            // Lỗi khác
            throw new HttpException(
                {
                    message: error.message || 'Internal server error',
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

    }
}
