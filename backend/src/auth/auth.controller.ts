import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { SelectAuthDto } from './dto/select-auth.dto';
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
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: AuthCredentialsDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<{ user: PublicUser }> {
    const user = await this.authService.login(body.email, body.password);
    this.setAuthCookie(response, this.authService.getAccessToken(user));
    return { user };
  }

  // ─── RBAC select auth ────────────────────────────────────────────────────────

  /**
   * POST /api/auth/select
   * Accepts { email }, finds the matching pre-seeded user, signs a JWT, and
   * sets it as an httpOnly cookie — identical cookie semantics to login/signup.
   * No password required (assessment convenience endpoint).
   */
  @Post('select')
  @HttpCode(HttpStatus.OK)
  async select(
    @Body() body: SelectAuthDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<{ success: boolean }> {
    const access_token = await this.authService.selectUser(body.email);
    this.setAuthCookie(response, access_token);
    return { success: true };
  }

  // ─── Current user ────────────────────────────────────────────────────────────

  /**
   * GET /api/auth/me
   * Returns the full user object including role and permissions for the
   * bearer of the current JWT.
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() request: AuthenticatedRequest): Promise<{ user: PublicUser }> {
    const user = await this.authService.me(request.user.id);
    return { user };
  }

  // ─── Logout ──────────────────────────────────────────────────────────────────

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(
    @Res({ passthrough: true }) response: Response
  ): { message: string } {
    response.clearCookie(ACCESS_TOKEN_COOKIE_NAME);
    return { message: 'Logged out successfully' };
  }

  // ─── Private helpers ─────────────────────────────────────────────────────────

  private setAuthCookie(response: Response, token: string): void {
    response.cookie(ACCESS_TOKEN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: ACCESS_TOKEN_MAX_AGE_MS
    });
  }
}
