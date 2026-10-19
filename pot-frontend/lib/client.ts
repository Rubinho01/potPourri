import type { Session } from './types';
export class HttpError extends Error { constructor(message: string, public status: number) { super(message); this.name='HttpError'; } }
async function readResponse<T>(res: Response): Promise<T> {
  const raw = await res.text(); let data: unknown;
  try { data=raw ? JSON.parse(raw) : undefined; } catch { data=undefined; }
  if (!res.ok) {
    const message = data && typeof data==='object' && 'message' in data && typeof data.message==='string' ? data.message : `A solicitação falhou (${res.status}).`;
    throw new HttpError(message,res.status);
  }
  return data as T;
}
export async function clientApi<T>(path: string, init: RequestInit = {}): Promise<T> {
  let res: Response;
  try { res = await fetch(`/api/gateway${path}`, { ...init, cache: 'no-store' }); }
  catch { throw new HttpError('Não foi possível conectar ao servidor.', 0); }
  return readResponse<T>(res);
}
export async function authApi<T>(path: string, body?: object): Promise<T> {
  let res: Response;
  try { res=await fetch(`/api/auth/${path}`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body??{})}); }
  catch { throw new HttpError('Falha ao conectar ao servidor.',0); }
  return readResponse<T>(res);
}
export async function sessionApi(): Promise<Session> {
  try { const res=await fetch('/api/session',{cache:'no-store'}); return readResponse<Session>(res); }
  catch { return {user:null}; }
}
export function errorText(e: unknown) { return e instanceof Error ? e.message : 'Algo deu errado. Tente novamente.'; }
export function isImageValid(file: File) { return file.type.startsWith('image/') && file.size<=5*1024*1024; }
