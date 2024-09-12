import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { UserLoginDto, UserRegistrationDto } from './dto/auth.dto';
import { RefreshTokenGuard } from './guards/ refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() userLoginBody: UserLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.login(userLoginBody);
    if (!user) {
      throw new HttpException('Invalid credentials', 401);
    }
    res.cookie('refreshToken', user.refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      accessToken: user.accessToken,
    };
  }

  @Post('register')
  async register(@Body() userRegistrationBody: UserRegistrationDto) {
    const user = await this.authService.register(userRegistrationBody);

    if (!user) {
      throw new HttpException('User already exists', 409);
    }

    return user;
  }

  @Get('refresh')
  @UseGuards(RefreshTokenGuard)
  async refresh(@Req() req: Request) {
    const user = req['user'];

    return user;
  }

  @Delete('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken');
    return { success: true };
  }
}
