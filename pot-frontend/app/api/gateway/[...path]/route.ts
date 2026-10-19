import { NextRequest, NextResponse } from 'next/server';
import { backendUrl, tokenForRequest } from '@/lib/session-server';

// Somente recursos e métodos previstos na API do projeto.
function isAllowed(parts: string[], method: string) {
  const [resource,id,operation]=parts;
  if (!['pieces','posts','users','categories'].includes(resource)||parts.length>3) return false;
  if (id && !/^\d+$/.test(id)) return false;
  if (operation && !(resource==='pieces'&&operation==='availability'||resource==='posts'&&operation==='active')) return false;
  if (parts.length===1) return method==='GET'||(['pieces','posts','categories'].includes(resource)&&method==='POST');
  if (parts.length===2) return method==='GET'||(['pieces','posts','categories'].includes(resource)&&['PUT','DELETE'].includes(method));
  return method==='PATCH';
}
async function handler(req:NextRequest, context:{params:Promise<{path:string[]}>}) {
  const {path}=await context.params;
  if (!isAllowed(path,req.method)) return NextResponse.json({message:'Rota não permitida.'},{status:404});
  if (req.method!=='GET') {
    const origin=req.headers.get('origin');
    if (origin && origin!==req.nextUrl.origin) return NextResponse.json({message:'Origem não permitida.'},{status:403});
  }
  const token=req.method==='GET'?null:await tokenForRequest();
  if (req.method!=='GET' && !token) return NextResponse.json({message:'Faça login para continuar.'},{status:401});
  const allowedQueries=new URLSearchParams();
  for (const key of ['categoryId','creatorId','authorId','isActive']) {
    const val=req.nextUrl.searchParams.get(key);if(val!==null) allowedQueries.set(key,val);
  }
  const url=`${backendUrl}/${path.join('/')}${allowedQueries.size?'?'+allowedQueries.toString():''}`;
  const contentType=req.headers.get('content-type')??'';
  const headers:Record<string,string>={};
  if (token) headers['Authorization']=`Bearer ${token}`;
  if (contentType.includes('application/json')) headers['Content-Type']='application/json';
  // FormData do browser deve ser recriado, permitindo que fetch monte o boundary correto.
  let body:BodyInit|undefined;
  if (req.method!=='GET'&&req.method!=='HEAD') {
    body=contentType.includes('multipart/form-data')?await req.formData():await req.text();
  }
  try {
    const res=await fetch(url,{method:req.method,headers,body,cache:'no-store'});
    const text=await res.text();
    return new NextResponse(res.status===204?null:text,{status:res.status,headers:{'Content-Type':res.headers.get('content-type')??'application/json','Cache-Control':'no-store'}});
  } catch {return NextResponse.json({message:'Servidor indisponível. Inicie o backend na porta 3333.'},{status:503});}
}
export const GET=handler;export const POST=handler;export const PUT=handler;export const PATCH=handler;export const DELETE=handler;
