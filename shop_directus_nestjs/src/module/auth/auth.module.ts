import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DirectusModule } from 'src/directus/directus.module';

@Module({
  imports: [
    DirectusModule
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
