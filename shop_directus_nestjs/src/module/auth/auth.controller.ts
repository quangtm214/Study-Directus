import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AuthLoginDto, CreateUserDto } from 'src/module/auth/auth.dto';
import { AuthService } from 'src/module/auth/auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        @Inject() private readonly authService: AuthService,
    ) { }

    @Post('login')
    async login(@Body() data: AuthLoginDto) {
        return this.authService.login(data.email, data.password);
    }

    @Post('register')
    async register(@Body() data: CreateUserDto) {
        return this.authService.register(data);
    }

}
