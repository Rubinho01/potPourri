import { NextRequest, NextResponse } from 'next/server';
import { apiFetch } from '@/lib/api';
import { authCookieOptions } from '@/lib/session-server';
export async function POST(req:NextRequest) {
  if(req.headers.get('origin') && req.headers.get('origin')!==req.nextUrl.origin) return NextResponse.json({message:'Origem não permitida.'},{status:403});
  const token=req.cookies.get('pot_refresh_token')?.value;
  if (token) {try {await apiFetch('/auth/logout',{method:'POST',body:JSON.stringify({refreshToken:token})});}catch{/* sessão local sempre encerrada */}}
  const res=NextResponse.json({message:'Sessão encerrada.'});
  res.cookies.set('pot_access_token','',{...authCookieOptions,maxAge:0});
  res.cookies.set('pot_refresh_token','',{...authCookieOptions,maxAge:0});
  return res;
}
