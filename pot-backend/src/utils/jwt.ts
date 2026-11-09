import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { env } from '../config/env';

import type { UserRole } from '../models/user.model';

export interface TokenPayload {
  sub: number; // id do usuário
  role?: UserRole; // só no access token; tokens antigos podem não ter
}

export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expiresIn as jwt.SignOptions['expiresIn'] });
}

export function signRefreshToken(payload: TokenPayload): string {
  // jwtid aleatório: sem ele, dois tokens emitidos no mesmo segundo saem
  // idênticos e quebram a coluna unique de refresh_tokens.token
  return jwt.sign(payload, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpiresIn as jwt.SignOptions['expiresIn'],
    jwtid: randomUUID(),
  });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, env.jwt.secret) as unknown as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, env.jwt.refreshSecret) as unknown as TokenPayload;
}
