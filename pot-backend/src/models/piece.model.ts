import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

// "Peça de moda". Nome do model em inglês (Piece) seguindo o padrão do
// projeto, mas fique à vontade pra renomear (ex: FashionPiece) se preferir.
interface PieceAttributes {
  id: number;
  description: string;
  photoUrl: string;
  photoPublicId: string | null; // id da imagem no Cloudinary, usado pra poder deletar/substituir
  link: string | null;
  size: string;
  available: boolean;
  creatorId: number; // FK -> users.id
  categoryId: number; // FK -> categories.id
  createdAt?: Date;
  updatedAt?: Date;
}

type PieceCreationAttributes = Optional<PieceAttributes, 'id' | 'photoPublicId' | 'link' | 'available'>;

export class Piece extends Model<PieceAttributes, PieceCreationAttributes> implements PieceAttributes {
  declare id: number;
  declare description: string;
  declare photoUrl: string;
  declare photoPublicId: string | null;
  declare link: string | null;
  declare size: string;
  declare available: boolean;
  declare creatorId: number;
  declare categoryId: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Piece.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    photoUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    photoPublicId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    size: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    available: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'pieces',
    timestamps: true,
  }
);
