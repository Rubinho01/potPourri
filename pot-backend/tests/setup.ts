import { beforeEach } from 'vitest';
import { sequelize } from '../src/config/database';
import '../src/models'; // registra os models e as associações

// Banco limpo antes de cada teste
beforeEach(async () => {
  await sequelize.sync({ force: true });
});
