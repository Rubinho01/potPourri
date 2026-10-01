import {
  DataTypes,
  Model,
  Optional,
  BelongsToManyAddAssociationsMixin,
  BelongsToManySetAssociationsMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyCountAssociationsMixin,
} from 'sequelize';
import { sequelize } from '../config/database';
import type { Piece } from './piece.model';

interface PostAttributes {
  id: number;
  authorId: number; // FK -> users.id (quem publicou)
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type PostCreationAttributes = Optional<PostAttributes, 'id' | 'isActive'>;

export class Post extends Model<PostAttributes, PostCreationAttributes> implements PostAttributes {
  declare id: number;
  declare authorId: number;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  // Mixins do relacionamento N:N com Piece (via post_pieces). Tipados à mão
  // porque não usamos sequelize-typescript/decorators — sem isso o TS não
  // sabe que addPieces/setPieces/getPieces existem em tempo de compilação,
  // mesmo que o Sequelize crie eles em runtime a partir do belongsToMany.
  declare addPieces: BelongsToManyAddAssociationsMixin<Piece, number>;
  declare setPieces: BelongsToManySetAssociationsMixin<Piece, number>;
  declare getPieces: BelongsToManyGetAssociationsMixin<Piece>;
  declare countPieces: BelongsToManyCountAssociationsMixin;
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'posts',
    timestamps: true,
  }
);
