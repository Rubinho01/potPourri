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

## Stack

- **Frontend:** Next.js (React) + Tailwind CSS + shadcn/ui
- **Backend:** Node.js com Express
- **Banco de dados:** PostgreSQL
- **Autenticação/autorização:** JWT (implementação própria ou Auth.js)
- **Hospedagem/deploy:** Vercel (frontend) + Render/Railway (backend + PostgreSQL)
- **Testes:** Jest
- **CI/CD:** GitHub Actions
- **Gestão de tarefas/Prototipação:** Jira | Figma

## Arquitetura

Arquitetura cliente-servidor simples — Frontend (Next.js) → API REST (Express) → PostgreSQL. Imagens de produtos/brechós armazenadas em serviço externo (ex.: Cloudinary). Diagrama a ser salvo em /docs/arquitetura.png no repositório.

## Instalação/execução

- **Instalação:** `cd frontend && npm install` / `cd backend && npm install`
- **Execução:** `npm run dev` (frontend, porta 3000) / `node index.js` (backend, porta 3001)

## Variáveis de ambiente

Ver .env.example (criar arquivo com variáveis sensíveis, ex.: DATABASE_URL)

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