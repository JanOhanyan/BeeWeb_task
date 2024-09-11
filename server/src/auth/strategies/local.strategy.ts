import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Strategy } from 'passport-local';
import { UnauthorizedException } from '@nestjs/common';

export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(email: string, password: string) {
    const user = await this.authService.login({ email, password });

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
