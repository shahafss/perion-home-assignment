import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthenticatedRequest } from './interfaces/authenticated-request.interface';
import { PublicUser } from './interfaces/public-user.interface';

const ACCESS_TOKEN_COOKIE_NAME = 'access_token';
const ACCESS_TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() body: AuthCredentialsDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<{ user: PublicUser }> {
    const user = await this.authService.signup(body.email, body.password);
    this.setAuthCookie(response, this.authService.getAccessToken(user));
    return { user };
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() body: AuthCredentialsDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<{ user: PublicUser }> {
    const user = await this.authService.login(body.email, body.password);
    this.setAuthCookie(response, this.authService.getAccessToken(user));
    return { user };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() request: AuthenticatedRequest): Promise<{ user: PublicUser }> {
    const user = await this.authService.me(request.user.sub);
    return { user };
  }

  @Post('logout')
  @HttpCode(200)
  logout(
    @Res({ passthrough: true }) response: Response
  ): { message: string } {
    response.clearCookie(ACCESS_TOKEN_COOKIE_NAME);
    return { message: 'Logged out successfully' };
  }

  private setAuthCookie(response: Response, token: string): void {
    response.cookie(ACCESS_TOKEN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: ACCESS_TOKEN_MAX_AGE_MS
    });
  }
}
