import { describe, it, expect } from 'vitest';
import { api, createUser, login } from './helpers';
import { RefreshToken } from '../src/models';
import { hashToken } from '../src/utils/tokenHash';

describe('Autenticação', () => {
  it('faz login com e-mail e senha corretos', async () => {
    await createUser('maria@pot.com');
    const res = await api().post('/api/auth/login').send({ email: 'maria@pot.com', password: '123456' });
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeTruthy();
    expect(res.body.refreshToken).toBeTruthy();
  });

  it('recusa senha errada com 401', async () => {
    await createUser('maria@pot.com');
    const res = await api().post('/api/auth/login').send({ email: 'maria@pot.com', password: 'errada' });
    expect(res.status).toBe(401);
  });

  it('não tem mais cadastro público (/auth/register)', async () => {
    const res = await api().post('/api/auth/register').send({ name: 'X', email: 'x@pot.com', password: '123456' });
    expect(res.status).toBe(404);
  });

  it('o access token carrega o role do usuário', async () => {
    await createUser('admin@pot.com', 'admin');
    const { accessToken } = await login('admin@pot.com');
    const payload = JSON.parse(Buffer.from(accessToken.split('.')[1], 'base64url').toString());
    expect(payload.role).toBe('admin');
  });
});

describe('Refresh token', () => {
  it('é guardado no banco só como hash, nunca puro', async () => {
    await createUser('maria@pot.com');
    const { refreshToken } = await login('maria@pot.com');

    expect(await RefreshToken.findOne({ where: { token: refreshToken } })).toBeNull();
    expect(await RefreshToken.findOne({ where: { token: hashToken(refreshToken) } })).not.toBeNull();
  });

  it('renova os tokens e o antigo deixa de valer (rotação)', async () => {
    await createUser('maria@pot.com');
    const { refreshToken } = await login('maria@pot.com');

    const first = await api().post('/api/auth/refresh').send({ refreshToken });
    expect(first.status).toBe(200);
    expect(first.body.refreshToken).not.toBe(refreshToken);

    const reused = await api().post('/api/auth/refresh').send({ refreshToken });
    expect(reused.status).toBe(401);
  });

  it('logout revoga o refresh token', async () => {
    await createUser('maria@pot.com');
    const { refreshToken } = await login('maria@pot.com');

    expect((await api().post('/api/auth/logout').send({ refreshToken })).status).toBe(204);
    expect((await api().post('/api/auth/refresh').send({ refreshToken })).status).toBe(401);
  });

  it('token salvo do jeito antigo (texto puro) não é aceito', async () => {
    const user = await createUser('maria@pot.com');
    const { refreshToken } = await login('maria@pot.com');
    // simula um registro anterior à mudança: token puro no banco
    await RefreshToken.destroy({ where: {} });
    await RefreshToken.create({ token: refreshToken, userId: user.id, expiresAt: new Date(Date.now() + 86400000) });

    expect((await api().post('/api/auth/refresh').send({ refreshToken })).status).toBe(401);
  });
});

describe('GET /auth/me', () => {
  it('devolve os dados completos do próprio usuário', async () => {
    await createUser('maria@pot.com');
    const { accessToken } = await login('maria@pot.com');
    const res = await api().get('/api/auth/me').set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ email: 'maria@pot.com', role: 'user' });
    expect(res.body.password).toBeUndefined();
  });

  it('exige token', async () => {
    expect((await api().get('/api/auth/me')).status).toBe(401);
  });
});
