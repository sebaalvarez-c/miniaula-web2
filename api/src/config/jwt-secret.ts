import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';

let devSecret: string | undefined;

export function getJwtSecret(config: ConfigService): string {
  const secret = config.get<string>('JWT_SECRET');
  if (secret) return secret;

  if (config.get<string>('NODE_ENV') === 'production') {
    throw new Error('JWT_SECRET es obligatorio en producción');
  }

  if (!devSecret) devSecret = randomBytes(32).toString('hex');
  return devSecret;
}
