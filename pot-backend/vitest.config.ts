import { defineConfig } from 'vitest/config';

// Os testes usam um SQLite em memória: não precisam do Postgres, não tocam no
// banco de ninguém e cada arquivo de teste começa com o banco vazio.
// As variáveis abaixo têm prioridade sobre o .env (o dotenv não sobrescreve).
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    setupFiles: ['tests/setup.ts'],
    env: {
      NODE_ENV: 'test',
      DB_DIALECT: 'sqlite',
      DB_HOST: ':memory:',
      DB_NAME: 'test',
      DB_USER: 'test',
      DB_PASSWORD: 'test',
      JWT_SECRET: 'segredo-de-teste',
      JWT_REFRESH_SECRET: 'outro-segredo-de-teste',
      CLOUDINARY_CLOUD_NAME: 'teste',
      CLOUDINARY_API_KEY: 'teste',
      CLOUDINARY_API_SECRET: 'teste',
    },
  },
});
