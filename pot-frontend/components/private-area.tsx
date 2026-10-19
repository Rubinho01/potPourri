"use client";
import {useEffect,useState} from 'react';import {useRouter} from 'next/navigation';import Link from 'next/link';import {sessionApi} from '@/lib/client';import type {User} from '@/lib/types';
import {StateMessage} from './common';
export function PrivateArea({children}:{children:(user:User)=>React.ReactNode}){
 const router=useRouter();const [user,setUser]=useState<User|null>(null);const [loading,setLoading]=useState(true);
 useEffect(()=>{let mounted=true;sessionApi().then(s=>{if(!mounted)return;if(s.user)setUser(s.user);else router.replace('/login');setLoading(false);});return()=>{mounted=false};},[router]);
 if(loading)return <StateMessage text="Verificando sua sessão..."/>;
 if(!user)return <StateMessage text="Faça login para acessar esta página."/>;
 return <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]"><aside className="h-fit rounded-2xl border border-pp-mist bg-white p-5"><p className="mb-4 text-sm font-semibold text-pp-olive-deep">Olá, {user.name.split(' ')[0]}</p><nav className="flex flex-col gap-3 text-sm text-neutral-700"><Link href="/minha-conta">Minha conta</Link><Link href="/minhas-pecas">Minhas peças</Link><Link href="/meus-posts">Meus looks</Link><Link href="/minha-conta/categorias">Categorias</Link></nav></aside><div className="min-w-0">{children(user)}</div></div>;
}
