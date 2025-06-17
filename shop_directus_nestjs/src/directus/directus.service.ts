import { Injectable } from '@nestjs/common';
import { createDirectus, rest, authentication, RestClient, DirectusClient, staticToken, AuthenticationData } from '@directus/sdk';
import type { Schema } from './schemas';

@Injectable()
export class DirectusService {
    private client = createDirectus<Schema>('http://localhost:8055')
        .with(authentication('json'))
        .with(rest());

    async login(email: string, password: string): Promise<AuthenticationData> {
        const authResponse = await this.client.login(email, password);
        return authResponse;
    }

    async setToken(token: string) {
        await this.client.setToken(token)
    }

    getClient() {
        return this.client;
    }


}
