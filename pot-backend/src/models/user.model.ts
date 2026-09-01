import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

// Atributos completos do model
interface UserAttributes {
  id: number;
  name: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Atributos opcionais na criação (id é gerado pelo banco)
type UserCreationAttributes = Optional<UserAttributes, 'id'>;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
  }
);
