import { DataTypes } from 'sequelize';
import { sequelize } from './database';
import { User } from '../models';

// O sync() não altera tabelas que já existem. Quem já tinha a tabela "users"
// criada antes do campo role ganha a coluna aqui, sem perder dados.
export async function ensureUserRoleColumn(): Promise<void> {
  const queryInterface = sequelize.getQueryInterface();
  const columns = await queryInterface.describeTable('users');
  if (!('role' in columns)) {
    await queryInterface.addColumn('users', 'role', {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'user',
    });
    console.log('🛠️  Coluna "role" adicionada na tabela users.');
  }
}

// Como ninguém mais se cadastra sozinho, o primeiro admin vem do .env.
// - Se o e-mail não existe: cria o usuário como admin.
// - Se já existe: promove a admin (a senha NÃO é alterada).
export async function bootstrapAdmin(): Promise<void> {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME ?? 'Administrador';

  if (!email) {
    const admins = await User.count({ where: { role: 'admin' } });
    if (admins === 0) {
      console.warn('⚠️  Nenhum admin cadastrado. Defina ADMIN_EMAIL e ADMIN_PASSWORD no .env.');
    }
    return;
  }

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    if (existing.role !== 'admin') {
      existing.role = 'admin';
      await existing.save();
      console.log(`👑 Usuário ${email} promovido a admin.`);
    }
    return;
  }

  if (!password || password.length < 6) {
    console.warn('⚠️  ADMIN_PASSWORD ausente ou com menos de 6 caracteres; admin não criado.');
    return;
  }

  await User.create({ name, email, password, role: 'admin' });
  console.log(`👑 Admin ${email} criado.`);
}
