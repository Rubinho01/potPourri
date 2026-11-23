import { env } from './config/env';
import { testConnection } from './config/database';
import { app } from './app';

async function start() {
  await testConnection();

  // Em produção, o ideal seria usar migrations do Sequelize CLI em vez de sync().
  // Aqui o sync() (que só cria tabelas que não existem, sem apagar dados) roda em
  // desenvolvimento ou quando DB_SYNC=true (ex.: primeiro deploy).
  if (env.nodeEnv === 'development' || env.db.sync) {
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
