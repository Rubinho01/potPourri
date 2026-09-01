unzip backend-ts-express.zip && cd backend-ts-express
npm install
cp .env.example .env    # edite com os dados do seu banco
npm run dev

Pronto! O zip tem a estrutura completa: config → models → services → controllers → routes → server.ts, com um CRUD de User de ponta a ponta funcionando como exemplo.

Pontos que valem sua atenção, já que é sua primeira vez com TS:

DB_DIALECT no .env.example está como mysql (com mysql2 instalado). Se você usa Postgres, troca pra postgres e no package.json troca mysql2 por pg + pg-hstore.
sequelize.sync() só roda em dev, e só serve pra criar a tabela rapidinho enquanto você testa. Não use em produção — lá vale a pena configurar sequelize-cli com migrations de verdade (posso te ajudar com isso depois se quiser).
O errorHandler.ts já reconhece a classe AppError — então em qualquer service ou controller você pode dar throw new AppError('mensagem', 404) que ele vira resposta HTTP automaticamente, sem precisar de try/catch espalhado (o asyncHandler cuida disso nas rotas).