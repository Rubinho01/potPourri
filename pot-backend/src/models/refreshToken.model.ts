import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface RefreshTokenAttributes {
  id: number;
  token: string; 
  userId: number;
  expiresAt: Date;
  revoked: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type RefreshTokenCreationAttributes = Optional<RefreshTokenAttributes, 'id' | 'revoked'>;

export class RefreshToken
  extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes>
  implements RefreshTokenAttributes
{
  declare id: number;
  declare token: string;
  declare userId: number;
  declare expiresAt: Date;
  declare revoked: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

RefreshToken.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    token: {
      type: DataTypes.STRING(512),
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    revoked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'refresh_tokens',
    timestamps: true,
  }
);
