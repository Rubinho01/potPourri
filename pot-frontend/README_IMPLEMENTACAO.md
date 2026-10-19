# Pot-Pourri — frontend implementado

Esta pasta é uma atualização do **pot-frontend** do arquivo `potPourri-develop(1).zip` recebido em 19/10/2026. **Não inclui mudanças do Cursor que não estavam naquele ZIP.**

## Instalação no seu computador

1. Faça backup da sua pasta `pot-frontend` atual (principalmente se o Cursor tiver feito mudanças após o ZIP original).
2. Substitua apenas os arquivos da pasta `pot-frontend` pela versão deste pacote. **Não substitua a pasta `pot-backend` nem o arquivo `.env`.**
3. Inicie o backend existente. Certifique-se de que as credenciais PostgreSQL e Cloudinary estejam preenchidas no `.env` do backend.
4. Em um terminal, execute:

```powershell
cd C:\Users\silvi\Documents\potPourri\pot-frontend
npm.cmd install
npm.cmd run dev
```

5. Abra `http://localhost:3000`. Caso o backend esteja fora de `http://localhost:3333/api`, defina `API_URL` em `pot-frontend/.env.local` (não inclua `/` no final), por exemplo:

```text
API_URL=http://localhost:3333/api
```

## Rotas

- Públicas: `/`, `/catalogo`, `/pecas/1`, `/looks`, `/looks/1`, `/brechos`, `/brechos/1`, `/login`, `/cadastro`.
- Com sessão: `/minha-conta`, `/minhas-pecas`, `/meus-posts`, `/minha-conta/categorias`.

Não há API de pagamentos, valores ou dados específicos de lojas físicas neste backend. A página de vendedores utiliza perfis de usuários que já possuem peças ou posts. O catálogo aplica os filtros localmente porque o backend original constrói o `where` mas não o usa em `piece.service.ts`.

## Segurança e cuidados

- A interface não recebe os JWTs: autenticação e uploads passam por rotas Next.js no mesmo domínio.
- O backend segue responsável por verificar permissões para edição, exclusão e publicação.
- **ALERTA PARA SUA BASE DE DADOS:** o arquivo original `pot-backend/src/server.ts` contém `sequelize.sync({force: true})`, que exclui e recria tabelas a cada inicialização. Corrija para `sequelize.sync()` antes de executar com dados importantes, após revisar o modelo e fazer backup. Este pacote não altera o backend.
- Não versione arquivos `.env` com senhas ou tokens.

## Validação

- Todos os arquivos `.ts`/`.tsx` foram analisados com o parser/transpilador TypeScript (verificação sintática, não de tipos).
- **Não foi possível executar `npm install`, `tsc`, `eslint` ou `next build` neste ambiente**: acesso a `registry.npmjs.org` falhou com `EAI_AGAIN`.
- Assim que instalar as dependências em sua máquina, execute dentro de `pot-frontend`:

```powershell
npx tsc --noEmit
npm.cmd run lint
npm.cmd run build
```

- Os fluxos que dependem do banco e Cloudinary precisam ser testados com as credenciais reais no seu computador.
