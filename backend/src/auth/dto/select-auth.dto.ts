import { IsEmail } from 'class-validator';

/**
 * Request body for POST /auth/select.
 * Identifies the user to impersonate/select — no password required.
 */
export class SelectAuthDto {
  @IsEmail({}, { message: 'email must be a valid email address' })
  email!: string;
}
