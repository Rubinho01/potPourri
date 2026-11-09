"use client";
import {useState,type FormEvent} from 'react';
import {SiteShell} from '@/components/site-shell';
import {Section,PageTitle,StateMessage} from '@/components/common';
import {PrivateArea} from '@/components/private-area';
import {useResource} from '@/components/use-resource';
import {clientApi,errorText} from '@/lib/client';
import type {User} from '@/lib/types';

// Regra do projeto: só o admin cadastra novos usuários.
// O backend garante isso (POST /users exige role admin); esta tela só esconde o formulário de quem não é admin.
function UserAdmin({me}:{me:User}){
  const users=useResource<User[]>('/users');
  const [error,setError]=useState('');const [notice,setNotice]=useState('');const [busy,setBusy]=useState(false);
  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();const form=e.currentTarget;const f=new FormData(form);
    const name=String(f.get('name')??'').trim();const email=String(f.get('email')??'').trim();const password=String(f.get('password')??'');const role=String(f.get('role')??'user');
    if(name.length<2||password.length<6){setError('Nome deve ter 2 caracteres e senha pelo menos 6.');return;}
    if(password!==f.get('confirm')){setError('As senhas não coincidem.');return;}
    setBusy(true);setError('');setNotice('');
    try{await clientApi<User>('/users',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,email,password,role})});form.reset();setNotice(`Usuário ${name} cadastrado.`);users.reload();}
    catch(e){setError(errorText(e));}finally{setBusy(false);}
  }
  async function remove(u:User){
    if(!confirm(`Excluir ${u.name}? As peças e looks dessa pessoa também serão excluídos.`))return;
    setBusy(true);setError('');setNotice('');
    try{await clientApi(`/users/${u.id}`,{method:'DELETE'});setNotice(`Usuário ${u.name} excluído.`);users.reload();}
    catch(e){setError(errorText(e));}finally{setBusy(false);}
  }
  if(me.role!=='admin')return <StateMessage error text="Apenas administradores podem cadastrar usuários."/>;
  return <div className="space-y-8">
    <form onSubmit={submit} className="rounded-2xl border border-pp-mist bg-white p-6">
      <h2 className="mb-5 font-serif text-2xl text-pp-olive-deep">Novo usuário</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block"><span className="field-label">Nome completo</span><input required minLength={2} maxLength={120} name="name" className="field"/></label>
        <label className="block"><span className="field-label">E-mail</span><input type="email" required name="email" className="field"/></label>
        <label className="block"><span className="field-label">Senha (mínimo 6 caracteres)</span><input type="password" minLength={6} required autoComplete="new-password" name="password" className="field"/></label>
        <label className="block"><span className="field-label">Confirmar senha</span><input type="password" minLength={6} required autoComplete="new-password" name="confirm" className="field"/></label>
        <label className="block"><span className="field-label">Perfil</span><select name="role" className="field" defaultValue="user"><option value="user">Usuário</option><option value="admin">Administrador</option></select></label>
      </div>
      {error&&<p role="alert" className="mt-4 text-sm text-red-800">{error}</p>}
      {notice&&<p role="status" className="mt-4 text-sm text-pp-olive-deep">{notice}</p>}
      <button disabled={busy} className="action-button mt-6">{busy?'Salvando...':'Cadastrar usuário'}</button>
    </form>
    <div>
      <h2 className="mb-4 font-serif text-2xl text-pp-olive-deep">Usuários cadastrados</h2>
      {users.loading?<StateMessage text="Carregando usuários..."/>:users.error?<StateMessage error text={users.error}/>:users.data?.length?
        <ul className="divide-y divide-pp-mist rounded-2xl border border-pp-mist bg-white">{users.data.map(u=><li key={u.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div><p className="font-semibold text-pp-olive-deep">{u.name}{u.role==='admin'&&<span className="ml-2 rounded-full bg-pp-sage/40 px-2 py-0.5 text-xs">admin</span>}</p><p className="text-xs text-neutral-500">{u.email}</p></div>
          {u.id!==me.id&&<button className="secondary-button !border-red-200 !text-red-700" disabled={busy} onClick={()=>void remove(u)}>Excluir</button>}
        </li>)}</ul>:<StateMessage text="Nenhum usuário cadastrado."/>}
    </div>
  </div>;
}
export default function Usuarios(){
  return <SiteShell><Section><PageTitle title="Usuários" eyebrow="Administração" description="Só administradores cadastram novas contas na plataforma."/><PrivateArea>{user=><UserAdmin me={user}/>}</PrivateArea></Section></SiteShell>;
}
