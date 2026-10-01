# Backend TypeScript + Express + Sequelize

Backend com separação em camadas (routes → controllers → services → models), auth JWT
com refresh token, validação com zod, CRUD de "peças de moda" com upload pro Cloudinary,
e "posts" que relacionam várias peças (N:N) com até 3 fotos.

## Como rodar

```bash
npm install
cp .env.example .env
# edite o .env com os dados do seu banco e as credenciais do Cloudinary
npm run dev
```

O `sync()` do Sequelize cria as tabelas que não existem, mas **não altera tabelas já
existentes**. Se você mudar um model e a tabela já existir, apague-a em dev
(`DROP TABLE ... CASCADE;`) ou use `sequelize-cli` com migrations reais em produção.

## Autenticação (JWT com refresh token)

```bash
curl -X POST http://localhost:3333/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Maria","email":"maria@email.com","password":"123456"}'

curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"maria@email.com","password":"123456"}'
```
Demais detalhes (refresh/logout) estão nos comentários do código em `auth.service.ts`.

## Categorias

Leitura pública; criar/editar/excluir exige login (qualquer usuário, sem roles por ora).

```bash
curl -X POST http://localhost:3333/api/categories \
  -H "Authorization: Bearer <ACCESS_TOKEN>" -H "Content-Type: application/json" \
  -d '{"name":"Vestidos"}'
```

## Peças de moda

Leitura pública. Criar exige login + 1 foto (`multipart/form-data`, campo `photo`).
Editar/excluir/alterar disponibilidade exigem ser o criador da peça.

```bash
# criar
curl -X POST http://localhost:3333/api/pieces \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -F "description=Vestido midi floral" -F "size=M" -F "categoryId=1" \
  -F "link=https://loja.com/produto/123" -F "photo=@/caminho/foto.jpg"

# marcar disponível/indisponível (só o criador)
curl -X PATCH http://localhost:3333/api/pieces/1/availability \
  -H "Authorization: Bearer <ACCESS_TOKEN>" -H "Content-Type: application/json" \
  -d '{"available": false}'
```

## Posts

Um post tem: autor (quem publicou), de 1 a 3 fotos, `isActive`, e uma lista de peças
(N:N) — **só peças que o próprio autor do post cadastrou podem entrar na lista**.

Leitura é pública. Criar/editar exigem login. `pieceIds` vai como um **JSON
stringificado dentro de um campo de texto do form-data** (porque o post é
multipart por causa das fotos) — não dá pra mandar um array "de verdade" em
form-data de forma portátil entre clientes, então padronizei assim.

```bash
# criar post (2 fotos, 2 peças)
curl -X POST http://localhost:3333/api/posts \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -F 'pieceIds=[1,2]' \
  -F "isActive=true" \
  -F "images=@/caminho/foto1.jpg" \
  -F "images=@/caminho/foto2.jpg"

# listar (filtros opcionais)
curl "http://localhost:3333/api/posts?authorId=2"
curl "http://localhost:3333/api/posts?isActive=true"

# buscar por id
curl http://localhost:3333/api/posts/1

# editar (tudo opcional: pieceIds, isActive, images — o que vier de "images"
# SUBSTITUI todas as fotos atuais do post)
curl -X PUT http://localhost:3333/api/posts/1 \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -F 'pieceIds=[1,2,3]'

# ativar/desativar (só o autor)
curl -X PATCH http://localhost:3333/api/posts/1/active \
  -H "Authorization: Bearer <ACCESS_TOKEN>" -H "Content-Type: application/json" \
  -d '{"isActive": false}'

# excluir (também apaga as fotos do Cloudinary; peças NÃO são apagadas, só a
# associação na tabela de junção)
curl -X DELETE http://localhost:3333/api/posts/1 \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

Resposta de um post (exemplo):
```json
{
  "id": 1,
  "authorId": 2,
  "isActive": true,
  "author": { "id": 2, "name": "Maria" },
  "images": [
    { "id": 10, "url": "https://res.cloudinary.com/.../posts/abc.jpg", "order": 0 },
    { "id": 11, "url": "https://res.cloudinary.com/.../posts/def.jpg", "order": 1 }
  ],
  "pieces": [
    { "id": 1, "description": "Vestido midi floral", "size": "M", "category": { "id": 1, "name": "Vestidos" } }
  ],
  "createdAt": "...",
  "updatedAt": "..."
}
```

## Estrutura

```
src/
├── config/       # env.ts, database.ts, cloudinary.ts
├── models/       # User, RefreshToken, Category, Piece, Post, PostImage, PostPiece
├── routes/       # auth, user, category, piece, post
├── controllers/  # camada HTTP (req/res)
├── services/     # regra de negócio
├── middlewares/  # errorHandler, asyncHandler, auth, upload (multer)
├── types/        # extensão de tipos do Express (req.user, req.file/files)
├── utils/        # AppError, jwt.ts, password.ts, cloudinaryUpload.ts, schemas (zod)
└── server.ts     # entrypoint
```

## Decisões tomadas (fique à vontade pra revisar)

- **Categoria com peça vinculada não pode ser excluída** (409) — evita peça órfã.
- **Post precisa de ao menos 1 peça** e de 1 a 3 fotos.
- **Editar post substitui TODAS as fotos** se `images` for enviado (não dá pra
  adicionar/remover uma foto isolada hoje — se precisar disso, dá pra criar um
  endpoint `DELETE /posts/:id/images/:imageId` depois).
- **`pieceIds` em form-data é um JSON stringificado**, não um array nativo.

## Próximos passos sugeridos

- Paginação em listagens
- Endpoint pra gerenciar fotos de post individualmente
- Testes (Jest + Supertest)
