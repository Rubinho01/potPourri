import dotenv from 'dotenv';

dotenv.config();

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] ?? defaultValue;
  if (value === undefined) {
    throw new Error(`Variável de ambiente obrigatória não definida: ${key}`);
  }
  return value;
}

export const env = {
  nodeEnv: getEnvVar('NODE_ENV', 'development'),
  port: Number(getEnvVar('PORT', '3333')),
  db: {
    host: getEnvVar('DB_HOST'),
    port: Number(getEnvVar('DB_PORT', '3306')),
    name: getEnvVar('DB_NAME'),
    user: getEnvVar('DB_USER'),
    password: getEnvVar('DB_PASSWORD'),
    dialect: getEnvVar('DB_DIALECT', 'mysql') as 'mysql' | 'postgres' | 'sqlite' | 'mariadb',
  },
  jwt: {
    secret: getEnvVar('JWT_SECRET'),
    expiresIn: getEnvVar('JWT_EXPIRES_IN', '15m'),
    refreshSecret: getEnvVar('JWT_REFRESH_SECRET'),
    refreshExpiresIn: getEnvVar('JWT_REFRESH_EXPIRES_IN', '7d'),
    refreshExpiresInDays: Number(getEnvVar('JWT_REFRESH_EXPIRES_IN_DAYS', '7')),
  },
};
