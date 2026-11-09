import { describe, it, expect } from 'vitest';
import { api, authAs, createUser } from './helpers';
import { Category, Piece } from '../src/models';

describe('Categorias (escrita só admin)', () => {
  it('leitura é pública', async () => {
    await Category.create({ name: 'Saias' });
    const res = await api().get('/api/categories');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it('admin cria, edita e exclui', async () => {
    const admin = await authAs('admin@pot.com', 'admin');
    const created = await api().post('/api/categories').set(admin).send({ name: 'Saias' });
    expect(created.status).toBe(201);
    expect((await api().put(`/api/categories/${created.body.id}`).set(admin).send({ name: 'Saias longas' })).status).toBe(200);
    expect((await api().delete(`/api/categories/${created.body.id}`).set(admin)).status).toBe(204);
  });

  it('usuário comum recebe 403', async () => {
    const cat = await Category.create({ name: 'Saias' });
    const user = await authAs('maria@pot.com');
    expect((await api().post('/api/categories').set(user).send({ name: 'Calças' })).status).toBe(403);
    expect((await api().put(`/api/categories/${cat.id}`).set(user).send({ name: 'X' })).status).toBe(403);
    expect((await api().delete(`/api/categories/${cat.id}`).set(user)).status).toBe(403);
  });
});

describe('Filtro de peças (GET /pieces)', () => {
  async function seed() {
    const ana = await createUser('ana@pot.com');
    const bia = await createUser('bia@pot.com');
    const saias = await Category.create({ name: 'Saias' });
    const calcas = await Category.create({ name: 'Calças' });
    const base = { size: 'M', photoUrl: 'https://x/foto.jpg', photoPublicId: 'x' };
    await Piece.create({ ...base, description: 'saia da ana', creatorId: ana.id, categoryId: saias.id });
    await Piece.create({ ...base, description: 'calça da bia', creatorId: bia.id, categoryId: calcas.id });
    await Piece.create({ ...base, description: 'saia da bia', creatorId: bia.id, categoryId: saias.id });
    return { ana, bia, saias, calcas };
  }
  const nomes = (body: { description: string }[]) => body.map((p) => p.description).sort();

  it('sem filtro traz todas', async () => {
    await seed();
    expect((await api().get('/api/pieces')).body).toHaveLength(3);
  });

  it('filtra por categoria', async () => {
    const { saias } = await seed();
    const res = await api().get(`/api/pieces?categoryId=${saias.id}`);
    expect(nomes(res.body)).toEqual(['saia da ana', 'saia da bia']);
  });

  it('filtra por criador', async () => {
    const { bia } = await seed();
    const res = await api().get(`/api/pieces?creatorId=${bia.id}`);
    expect(nomes(res.body)).toEqual(['calça da bia', 'saia da bia']);
  });

  it('combina os dois filtros', async () => {
    const { bia, saias } = await seed();
    const res = await api().get(`/api/pieces?categoryId=${saias.id}&creatorId=${bia.id}`);
    expect(nomes(res.body)).toEqual(['saia da bia']);
  });

  it('não expõe e-mail do criador', async () => {
    await seed();
    const res = await api().get('/api/pieces');
    expect(res.body[0].creator.email).toBeUndefined();
  });

  it('filtro inválido retorna 400', async () => {
    expect((await api().get('/api/pieces?categoryId=abc')).status).toBe(400);
  });
});
