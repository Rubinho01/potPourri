// Este arquivo estende os tipos globais do Express.
// Precisa existir dentro de `include` do tsconfig e não deve ter import/export
// no topo além dos usados dentro do declare global.

declare namespace Express {
  export interface Request {
    user?: {
      id: number;
    };
  }
}
