import { env } from './config/env';
import { testConnection } from './config/database';
import { app } from './app';

async function start() {
  await testConnection();

  // Em produção, use migrations do Sequelize CLI em vez de sync().
  // sync() aqui é só pra facilitar o começo em desenvolvimento.
  if (env.nodeEnv === 'development') {
    const { sequelize } = await import('./config/database');
    await sequelize.sync();
  }

  const { ensureUserRoleColumn, bootstrapAdmin } = await import('./config/bootstrapAdmin');
  await ensureUserRoleColumn();
  await bootstrapAdmin();

  app.listen(env.port, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${env.port}`);
  });
}

start().catch((error) => {
  console.error('Falha ao iniciar o servidor:', error);
  process.exit(1);
});
