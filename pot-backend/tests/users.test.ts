import { describe, it, expect } from 'vitest';
import { api, authAs, createUser, login } from './helpers';

const novo = { name: 'Ana', email: 'ana@pot.com', password: '123456' };

describe('Cadastro de usuários (só admin)', () => {
  it('admin cadastra usuário (role padrão "user", sem devolver senha)', async () => {
    const admin = await authAs('admin@pot.com', 'admin');
    const res = await api().post('/api/users').set(admin).send(novo);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ email: 'ana@pot.com', role: 'user' });
    expect(res.body.password).toBeUndefined();
  });

  it('o usuário cadastrado consegue fazer login', async () => {
    const admin = await authAs('admin@pot.com', 'admin');
    await api().post('/api/users').set(admin).send(novo);
    const { accessToken } = await login('ana@pot.com');
    expect(accessToken).toBeTruthy();
  });

  it('usuário comum recebe 403', async () => {
    const user = await authAs('maria@pot.com');
    expect((await api().post('/api/users').set(user).send(novo)).status).toBe(403);
  });

  it('sem login recebe 401', async () => {
    expect((await api().post('/api/users').send(novo)).status).toBe(401);
  });

  it('exige senha (422)', async () => {
    const admin = await authAs('admin@pot.com', 'admin');
    const res = await api().post('/api/users').set(admin).send({ name: 'Ana', email: 'ana@pot.com' });
    expect(res.status).toBe(422);
    expect(res.body.message).toBe('Senha é obrigatória');
  });

  it('e-mail repetido recebe 409', async () => {
    const admin = await authAs('admin@pot.com', 'admin');
    await api().post('/api/users').set(admin).send(novo);
    expect((await api().post('/api/users').set(admin).send(novo)).status).toBe(409);
  });
});

describe('Listar e excluir usuários (só admin)', () => {
  it('só admin lista usuários', async () => {
    const admin = await authAs('admin@pot.com', 'admin');
    const user = await authAs('maria@pot.com');
    expect((await api().get('/api/users').set(admin)).status).toBe(200);
    expect((await api().get('/api/users').set(user)).status).toBe(403);
  });

  it('usuário comum não exclui ninguém', async () => {
    const alvo = await createUser('alvo@pot.com');
    const user = await authAs('maria@pot.com');
    expect((await api().delete(`/api/users/${alvo.id}`).set(user)).status).toBe(403);
  });

  it('admin exclui outro usuário, mas não a si mesmo', async () => {
    const alvo = await createUser('alvo@pot.com');
    await createUser('admin@pot.com', 'admin');
    const { accessToken } = await login('admin@pot.com');
    const admin = { Authorization: `Bearer ${accessToken}` };
    const me = await api().get('/api/auth/me').set(admin);

    expect((await api().delete(`/api/users/${alvo.id}`).set(admin)).status).toBe(204);
    expect((await api().delete(`/api/users/${me.body.id}`).set(admin)).status).toBe(400);
  });
});

describe('Perfil público (GET /users/:id)', () => {
  it('não expõe e-mail nem role', async () => {
    const maria = await createUser('maria@pot.com');
    const res = await api().get(`/api/users/${maria.id}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('maria');
    expect(res.body.email).toBeUndefined();
    expect(res.body.role).toBeUndefined();
  });
});
