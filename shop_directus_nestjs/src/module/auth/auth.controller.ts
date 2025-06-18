import { Body, Controller, Get, Inject, Post, Query, Render, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthLoginDto, CreateUserDto } from 'src/module/auth/auth.dto';
import { AuthService } from 'src/module/auth/auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        @Inject() private readonly authService: AuthService,
    ) { }

    @Get('login')
    @Render('login')
    getLoginForm(@Query('error') error?: string) {
        return {
            error: error ? decodeURIComponent(error) : undefined,
        };
    }

    @Post('login')
    async login(@Body() data: AuthLoginDto,
        @Res({ passthrough: true }) res: Response
    ) {
        const auth = await this.authService.login(data.email, data.password);
        res.cookie('access_token', auth.access_token, {
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 60,
            sameSite: 'lax',
        });
        res.cookie('refresh_token', auth.refresh_token, {
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
            sameSite: 'lax',
        });
        return res.redirect('/product');
    }


    @Get('register')
    @Render('register-customer')
    getRegisterForm(@Query('error') error?: string, @Query('message') message?: string) {
        return {
            error: error ? decodeURIComponent(error) : undefined,
            message: message ? decodeURIComponent(message) : undefined,
        };
    }

    @Post('register')
    async register(@Body() data: CreateUserDto, @Res() res: Response) {
        await this.authService.register(data);
        return res.redirect('/auth/register?message=' + encodeURIComponent('Đăng ký thành công!'));
    }

}
