import request from 'supertest';
import { app } from '../src/app';
import { User } from '../src/models';
import type { UserRole } from '../src/models/user.model';

export const api = () => request(app);

export async function createUser(email: string, role: UserRole = 'user', password = '123456') {
  return User.create({ name: email.split('@')[0], email, password, role });
}

// Faz login pela API e devolve os tokens
export async function login(email: string, password = '123456') {
  const res = await api().post('/api/auth/login').send({ email, password });
  return res.body as { accessToken: string; refreshToken: string };
}

// Cria o usuário e já devolve o header Authorization pronto
export async function authAs(email: string, role: UserRole = 'user') {
  await createUser(email, role);
  const { accessToken } = await login(email);
  return { Authorization: `Bearer ${accessToken}` };
}
