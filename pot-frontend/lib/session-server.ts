import { cookies } from 'next/headers';
import { apiFetch } from './api';
import type { User } from './types';

export const authCookieOptions = { httpOnly:true, sameSite:'lax' as const, secure:process.env.NODE_ENV==='production', path:'/' };
const API_URL = process.env.API_URL ?? 'http://localhost:3333/api';
export const backendUrl = API_URL;
export type TokenPair = {accessToken:string; refreshToken:string};
const refreshInFlight=new Map<string,Promise<TokenPair>>();
async function rotateRefreshToken(token:string):Promise<TokenPair> {
  let pending=refreshInFlight.get(token);
  if (!pending) {
    pending=apiFetch<TokenPair>('/auth/refresh',{method:'POST',body:JSON.stringify({refreshToken:token})});
    refreshInFlight.set(token,pending);
    void pending.finally(()=>refreshInFlight.delete(token)).catch(()=>undefined);
  }
  return pending;
}
export function jwtPayload(token: string): {sub?:number|string;exp?:number}|null {
  try {
    const segment=token.split('.')[1]; if (!segment) return null;
    const data=JSON.parse(Buffer.from(segment,'base64url').toString('utf8'));
    if (!data || typeof data!=='object' || (typeof data.sub!=='number' && typeof data.sub!=='string')) return null;
    return data;
  } catch { return null; }
}
export async function tokenForRequest(): Promise<string|null> {
  const jar=await cookies();
  const access=jar.get('pot_access_token')?.value;
  const payload=access ? jwtPayload(access) : null;
  if (access && payload && typeof payload.exp==='number' && payload.exp>Math.floor(Date.now()/1000)+20) return access;
  const refresh=jar.get('pot_refresh_token')?.value;
  if (!refresh) return null;
  let pair:TokenPair;
  try { pair=await rotateRefreshToken(refresh); }
  catch {
    jar.delete('pot_access_token');jar.delete('pot_refresh_token');return null;
  }
  jar.set('pot_access_token',pair.accessToken,{...authCookieOptions,maxAge:15*60});
  jar.set('pot_refresh_token',pair.refreshToken,{...authCookieOptions,maxAge:7*24*60*60});
  return pair.accessToken;
}
export async function authenticatedUser(): Promise<User|null> {
  const token=await tokenForRequest();if (!token) return null;
  const id=Number(jwtPayload(token)?.sub);
  if (!Number.isInteger(id) || id<=0) return null;
  // Uma rota de usuário é pública no backend; as mutações continuam protegidas pelo JWT validado lá.
  try { return await apiFetch<User>(`/users/${id}`); } catch { return null; }
}
