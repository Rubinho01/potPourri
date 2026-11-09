import { createHash } from 'crypto';

// Hash do refresh token pra guardar no banco (nunca o token puro).
//
// Por que SHA-256 e não bcrypt (como na senha)?
// - A senha é curta e previsível, então precisa de um hash lento (bcrypt).
// - O refresh token é um JWT longo e aleatório: um SHA-256 já é impossível
//   de reverter, e por ser determinístico dá pra buscar no banco por ele
//   (WHERE token = hash). Com bcrypt cada hash sai diferente e não daria.
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
