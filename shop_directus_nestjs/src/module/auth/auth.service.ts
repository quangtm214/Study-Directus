import { AuthenticationData, createItem, createUser } from '@directus/sdk';
import { BadRequestException, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { mapDirectusErrorCodeToStatus } from 'src/common/filters/mapDirectusErrorCodeToStatus';
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

    async register(data: CreateUserDto) {
        try {
            // Gọi hàm đăng ký từ DirectusService
            const client = this.directusService.getClient();
            const result = await client.request(
                createUser(data, {})
            );
            return result;
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

}
