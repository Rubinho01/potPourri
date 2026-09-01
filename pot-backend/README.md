# Backend TypeScript + Express + Sequelize

Esqueleto mínimo com boas práticas: separação em camadas (routes → controllers → services →
models), tratamento de erros centralizado, validação de entrada com zod e conexão Sequelize
já configurada.

## Como rodar

```bash
npm install
cp .env.example .env
# edite o .env com os dados do seu banco
npm run dev
```

O `sync()` do Sequelize roda automaticamente em desenvolvimento e cria a tabela `users`
se ela não existir. **Em produção, troque por migrations** (`sequelize-cli`), nunca use
`sync()` fora de dev.

## Testando a rota de exemplo

```bash
# criar usuário
curl -X POST http://localhost:3333/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Maria","email":"maria@email.com"}'

# listar usuários
curl http://localhost:3333/api/users

# buscar por id
curl http://localhost:3333/api/users/1

# deletar
curl -X DELETE http://localhost:3333/api/users/1
```

## Estrutura

```
src/
├── config/       # env.ts e conexão com o banco (database.ts)
├── models/       # models Sequelize (User de exemplo)
├── routes/       # definição de endpoints
├── controllers/  # camada HTTP (req/res)
├── services/     # regra de negócio, sem saber de HTTP
├── middlewares/  # errorHandler, asyncHandler
├── utils/        # AppError, schemas de validação (zod)
└── server.ts     # entrypoint
```

## Próximos passos sugeridos

- Trocar `mysql2` por `pg`/`pg-hstore` se for usar PostgreSQL (ajuste `DB_DIALECT` no `.env`)
- Configurar `sequelize-cli` para migrations reais
- Adicionar autenticação (JWT) como middleware em `middlewares/`
- Adicionar testes (Jest + Supertest)
- Configurar ESLint + Prettier
