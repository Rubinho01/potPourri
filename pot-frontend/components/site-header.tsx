"use client";
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {sessionApi} from '@/lib/client';
export function SiteHeader(){
 const [signedIn,setSignedIn]=useState(false);
 useEffect(()=>{let active=true;sessionApi().then(s=>{if(active)setSignedIn(!!s.user);});return()=>{active=false};},[]);
 return <header className="sticky top-0 z-40 border-b border-pp-olive/10 bg-white/95 backdrop-blur">
   <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-8">
     <Link className="text-2xl font-semibold tracking-[.22em] text-pp-olive" href="/">POT·POURRI</Link>
     <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold uppercase tracking-[.12em] text-pp-olive-deep" aria-label="Menu principal">
       <Link className="hover:underline" href="/catalogo">Peças</Link><Link className="hover:underline" href="/looks">Looks</Link><Link className="hover:underline" href="/brechos">Vendedores</Link>
       <Link className="rounded-full border border-pp-olive px-4 py-2 hover:bg-pp-paper" href={signedIn?'/minha-conta':'/login'}>{signedIn?'Minha conta':'Entrar'}</Link>
     </nav>
   </div>
 </header>
}
