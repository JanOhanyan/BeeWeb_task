import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    if (!request.headers.cookie) {
      throw new HttpException('No cookies found', HttpStatus.BAD_REQUEST);
    }

    const cookies = request.headers.cookie.split(';').reduce(
      (acc, cookie) => {
        const [name, value] = cookie.trim().split('=');
        acc[name] = value;
        return acc;
      },
      {} as Record<string, string>,
    );

    const refreshToken = cookies['refreshToken'];

    if (!refreshToken) {
      throw new HttpException(
        'Refresh token not found',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.authService.refresh(refreshToken);
    if (!user) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }

    request['user'] = user;
    return true;
  }
}
