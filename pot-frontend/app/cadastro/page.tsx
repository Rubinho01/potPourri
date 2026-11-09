import { redirect } from 'next/navigation';

// Não existe mais auto-cadastro: só o admin cadastra usuários.
// Links antigos para /cadastro vão para a tela do admin (quem não for admin
// vê o aviso lá; quem não estiver logado é levado ao login).
export default function Cadastro() {
  redirect('/minha-conta/usuarios');
}
