import { AuthenticationData, createItem, createUser } from '@directus/sdk';
import { BadRequestException, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { DirectusService } from 'src/directus/directus.service';
import { CreateUserDto } from 'src/module/auth/auth.dto';

@Injectable()
export class AuthService {

    constructor(
        @Inject() private readonly directusService: DirectusService,
    ) {
    }

    async login(email: string, password: string): Promise<AuthenticationData> {
        try {
            const token = await this.directusService.login(email, password);
            return token;
        } catch (error) {
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

    async register(data: CreateUserDto) {
        try {
            // Gọi hàm đăng ký từ DirectusService
            const client = this.directusService.getClient();
            const result = await client.request(
                createUser(data, {})
            );
            return result;
        } catch (error) {
            if (error?.errors) {
                const firstError = error.errors[0];
                throw new BadRequestException(
                    {
                        message: firstError.message || 'Directus error',
                        code: firstError.extensions?.code || 'UNKNOWN',
                        detail: firstError.extensions || null,
                    },
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
