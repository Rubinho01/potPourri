import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { testConnection } from './config/database';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';

const app = express();

// Middlewares globais
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api', routes);

// 404 e erros (sempre por último)
app.use(notFoundHandler);
app.use(errorHandler);

async function start() {
  await testConnection();

  // Em produção, use migrations do Sequelize CLI em vez de sync().
  // sync() aqui é só pra facilitar o começo em desenvolvimento.
  if (env.nodeEnv === 'development') {
    const { sequelize } = await import('./config/database');
    await sequelize.sync();
  }

  app.listen(env.port, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${env.port}`);
  });
}

start().catch((error) => {
  console.error('Falha ao iniciar o servidor:', error);
  process.exit(1);
});
