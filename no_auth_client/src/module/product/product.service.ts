import { createItem, createItems, readItems, RegularCollections } from '@directus/sdk';
import { BadRequestException, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { mapDirectusErrorCodeToStatus } from 'src/common/filters/mapDirectusErrorCodeToStatus';
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
        try {
            const client = this.directusService.getClient();
            const respone = await client.request(
                readItems('product', {
                    fields: [
                        'id',
                        'name',
                        'price',
                        'description',
                        'image',
                        'status',
                        'category.id',
                        'category.name'
                    ],
                    filter: {
                        status: { _eq: 'published' },
                    },
                })
            )
            console.log('Products fetched successfully:', respone);
            return respone
        } catch (error) {
            const firstError = error?.errors?.[0];

            const code = firstError?.extensions?.code || 'UNKNOWN';
            const message = firstError?.message || 'Lỗi không xác định từ Directus';

            throw new HttpException(
                {
                    message,
                    code,
                    detail: firstError?.extensions || null,
                },
                mapDirectusErrorCodeToStatus(code)
            );
        }
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
                // Ném lỗi với thông tin chi tiết
                console.log('Error creating product:', firstError);
                throw new Error(firstError?.message || 'Lỗi hệ thống, vui lòng thử lại.');

            }

            // Lỗi khác
            throw new Error('Lỗi hệ thống, vui lòng thử lại.');
        }

    }
}
