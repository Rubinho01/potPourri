import { NextRequest, NextResponse } from 'next/server';
import { apiFetch,ApiError } from '@/lib/api';
import type { TokenPair } from '@/lib/session-server';
import { authCookieOptions } from '@/lib/session-server';
export async function POST(req:NextRequest) {
  if (req.headers.get('origin') && req.headers.get('origin')!==req.nextUrl.origin) return NextResponse.json({message:'Origem não permitida.'},{status:403});
  try {
    const body=await req.json();
    const tokens=await apiFetch<TokenPair>('/auth/register',{method:'POST',body:JSON.stringify({name:body.name,email:body.email,password:body.password})});
    const res=NextResponse.json({message:'Conta criada com sucesso.'},{status:201});
    res.cookies.set('pot_access_token',tokens.accessToken,{...authCookieOptions,maxAge:15*60});
    res.cookies.set('pot_refresh_token',tokens.refreshToken,{...authCookieOptions,maxAge:7*24*60*60});
    return res;
  } catch(e){return NextResponse.json({message:e instanceof Error?e.message:'Falha ao cadastrar usuário.'},{status:e instanceof ApiError?(e.status||503):400});}
}
