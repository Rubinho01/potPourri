import { User, RefreshToken } from '../models';
import { AppError } from '../utils/AppError';
import { comparePassword } from '../utils/password';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { env } from '../config/env';

interface LoginInput {
  email: string;
  password: string;
}

function refreshExpiryDate(): Date {
  const date = new Date();
  date.setDate(date.getDate() + env.jwt.refreshExpiresInDays);
  return date;
}

async function issueTokens(user: User) {
  const userId = user.id;
  // O role vai no access token pra rota saber se é admin sem consultar o banco.
  // Ele dura pouco (15 min), então uma mudança de role vale no próximo refresh.
  const accessToken = signAccessToken({ sub: userId, role: user.role });
  const refreshToken = signRefreshToken({ sub: userId });

  // Guardamos o refresh token no banco pra poder revogar (logout) e conferir
  // se ele ainda é válido/não foi reutilizado depois de rotacionado.
  // Nota: pra um nível extra de segurança, guarde um hash do token em vez do
  // valor puro (mesma ideia do hashPassword), assim como se faz com senhas.
  await RefreshToken.create({
    token: refreshToken,
    userId,
    expiresAt: refreshExpiryDate(),
  });

  return { accessToken, refreshToken };
}

export const authService = {
  // Não existe mais auto-cadastro: novos usuários são criados por um admin
  // em POST /api/users (ver user.routes.ts).

  async login(data: LoginInput) {
    const user = await User.findOne({ where: { email: data.email } });
    if (!user) {
      throw new AppError('Credenciais inválidas', 401);
    }

    const passwordMatches = await comparePassword(data.password, user.password);
    if (!passwordMatches) {
      throw new AppError('Credenciais inválidas', 401);
    }

    return issueTokens(user);
  },

  async refresh(oldToken: string) {
    // 1. valida a assinatura/expiração do JWT em si
    let payload;
    try {
      payload = verifyRefreshToken(oldToken);
    } catch {
      throw new AppError('Refresh token inválido ou expirado', 401);
    }

    // 2. confere se ele existe no banco, não foi revogado e não expirou lá também
    const stored = await RefreshToken.findOne({ where: { token: oldToken } });
    if (!stored || stored.revoked || stored.expiresAt < new Date()) {
      throw new AppError('Refresh token inválido ou expirado', 401);
    }

    // 3. rotação: revoga o token antigo e emite um par novo.
    // Isso limita o dano se um refresh token vazar — ele só serve uma vez.
    stored.revoked = true;
    await stored.save();

    // Busca o usuário de novo pra pegar o role atual (e barrar usuário excluído)
    const user = await User.findByPk(payload.sub);
    if (!user) {
      throw new AppError('Refresh token inválido ou expirado', 401);
    }

    return issueTokens(user);
  },

  async logout(token: string) {
    const stored = await RefreshToken.findOne({ where: { token } });
    if (stored) {
      stored.revoked = true;
      await stored.save();
    }
    // Se o token não existir/já tiver sido revogado, tratamos como sucesso
    // idempotente — não precisa vazar essa informação pro cliente.
  },
};
