# Pot Pourri

**Descrição:** plataforma web que conecta consumidores e brechós parceiros, promovendo moda sustentável e economia circular

## Integrantes e responsabilidades

- **Rubem Krüger** — Backend (API do MVP) / Repositório e README / Deploy e Homologação
- **Thomas Prunner** — Comunicação com professor/parceiro / Frontend (Telas do MVP) / Backlog e Cronograma (Jira)
- **Sílvio Ávila** — Arquitetura (Diagrama + descrição) / Testes e Validação
- **Eduardo de Oliveira** — Frontend (Telas do MVP) / Deploy e Homologação
- **Diego Nessler** — Repositório e README
- **Nicolas Eduardo** — Backend (API do MVP)
- **Banco de dados** (modelagem + migrations): responsabilidade da equipe

## Problema/público

Dificuldade de consumidores em encontrar brechós e de brechós em ganhar visibilidade digital. Público beneficiado: consumidores interessados em moda sustentável/economia circular e proprietários de pequenos e médios brechós que buscam visibilidade digital.

## Objetivo (MVP)

Plataforma onde consumidores buscam produtos de brechós parceiros cadastrados, e brechós cadastram e gerenciam seus próprios produtos.

Fluxo principal: usuário cria conta → navega/busca produtos por brechó ou categoria → visualiza detalhes do produto e dados de contato do brechó.

Funcionalidades incluídas: cadastro/login de usuário, cadastro de brechó, CRUD de produtos, busca e filtro simples, perfil público do brechó.

Fora do escopo do MVP: pagamento/checkout online, chat entre usuários, sistema de avaliações e notificações.

## Regras de cadastro de novos usuários

Rota: `POST /api/auth/register` (definida em `pot-backend/src/routes/auth.routes.ts`, montada em `src/routes/index.ts` com o prefixo `/api` configurado no `src/server.ts`).

**Campos obrigatórios**

- `name`: mínimo de 2 caracteres
- `email`: formato de e-mail válido
- `password`: mínimo de 6 caracteres

**Regras**

- O e-mail deve ser único. Se já existir um usuário com ele, a API retorna erro **409** com a mensagem "Já existe um usuário com esse e-mail".
- Os dados são validados na entrada com Zod (`registerSchema`), e o model também exige e-mail válido e campos não nulos.
- Se algum campo for inválido (por exemplo, senha com menos de 6 caracteres), a API retorna erro **422** com o corpo `{"message": "Senha deve ter ao menos 6 caracteres"}` (a mensagem muda conforme o campo).
- A senha nunca é armazenada em texto puro: ela é hasheada com bcrypt (10 rounds) antes de ser salva.
- A senha nunca é devolvida em respostas da API, pois o model a remove na serialização do usuário.

**Resposta em caso de sucesso**

- O usuário já fica autenticado: a API devolve um `accessToken` e um `refreshToken` (JWT), sem necessidade de fazer login em seguida.

**Fora do escopo do MVP**

- Confirmação de e-mail
- Recuperação de senha
- Login social

## Stack

- **Frontend:** Next.js (React) + Tailwind CSS + shadcn/ui
- **Backend:** Node.js com Express (TypeScript) + Sequelize
- **Banco de dados:** PostgreSQL
- **Validação:** Zod
- **Autenticação/autorização:** JWT próprio (access token + refresh token) com senhas protegidas por bcrypt
- **Hospedagem/deploy:** Vercel (frontend) + Render/Railway (backend + PostgreSQL)
- **Testes:** Jest
- **CI/CD:** GitHub Actions
- **Gestão de tarefas/Prototipação:** Jira | Figma

## Arquitetura

Arquitetura cliente-servidor simples — Frontend (Next.js) → API REST (Express) → PostgreSQL. Imagens de produtos/brechós armazenadas em serviço externo (ex.: Cloudinary). Diagrama a ser salvo em /docs/arquitetura.png no repositório.

## Instalação/execução

- **Instalação:** `cd pot-frontend && npm install` / `cd pot-backend && npm install`
- **Execução:** `npm run dev` em cada pasta (`pot-frontend` e `pot-backend`). A porta do backend é definida no `.env`.

## Variáveis de ambiente

No backend, copie o arquivo de exemplo e preencha os valores:

```bash
cd pot-backend
cp .env.example .env
```

O `.env` contém dados sensíveis (ex.: `DATABASE_URL`, chaves JWT) e **não deve ser commitado**.

## Backlog

- Setup do repositório e CI básico
- Modelagem do banco (usuários, brechós, produtos, categorias)
- Cadastro/login de usuário (auth)
- Cadastro de brechó
- CRUD de produtos
- Busca e filtro de produtos
- Página de perfil público do brechó
- Deploy inicial em ambiente de homologação
- Testes básicos das rotas principais
- Documentação (README, arquitetura)

## Cronograma

- **10/08 a 24/08:** ponto de partida mínimo concluído
- **24/08 a 21/09:** Sprint 1 em desenvolvimento (auth + cadastro de brechó/produto)
- **21/09 a 05/10:** Sprint 1 revisada e Sprint 2 planejada
- **05/10 a 19/10:** versão Alpha (busca/filtro e perfil do brechó integrados)
- **19/10 a 16/11:** preparação para implementação/validação
- **Novembro:** implementação, validação e evolução da entrega final

## Próximos passos

Iniciar modelagem de banco e autenticação no Sprint 1