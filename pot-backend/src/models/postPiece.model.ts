import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

// Tabela de junção do N:N entre Post e Piece. Criada como model explícito
// (em vez de deixar o Sequelize gerar implicitamente) pra manter nome de
// tabela/colunas sob nosso controle. Sem atributos extras além das FKs.
interface PostPieceAttributes {
  postId: number;
  pieceId: number;
}

export class PostPiece extends Model<PostPieceAttributes> implements PostPieceAttributes {
  declare postId: number;
  declare pieceId: number;
}

PostPiece.init(
  {
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    pieceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    sequelize,
    tableName: 'post_pieces',
    timestamps: false,
  }
);
