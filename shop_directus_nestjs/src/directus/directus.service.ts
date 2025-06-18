import { Injectable } from '@nestjs/common';
import { createDirectus, rest, authentication, RestClient, DirectusClient, staticToken, AuthenticationData, refresh } from '@directus/sdk';
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

    async refreshToken(refreshToken: string) {
        const authResponse = await this.client.request(
            refresh("json", refreshToken,)
        )
        this.client.setToken(authResponse.access_token);
        console.log('Token refreshed successfully:', authResponse);
        return authResponse;
    }

    getClient() {
        return this.client;
    }


}
