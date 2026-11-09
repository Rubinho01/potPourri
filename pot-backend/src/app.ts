import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';

// O app fica separado do server.ts (que só conecta no banco e chama listen)
// pra que os testes consigam usar o app sem abrir uma porta.
export const app = express();

// Middlewares globais
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api', routes);

// 404 e erros (sempre por último)
app.use(notFoundHandler);
app.use(errorHandler);
