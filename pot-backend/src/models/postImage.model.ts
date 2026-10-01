import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

// Cada linha é UMA foto do post (1 a 3 por post — a regra de quantidade é
// validada no controller/service, não dá pra expressar isso só no schema
// do banco). "order" guarda a posição de exibição (0, 1, 2).
interface PostImageAttributes {
  id: number;
  postId: number; // FK -> posts.id
  url: string;
  publicId: string; // id da imagem no Cloudinary, pra permitir apagar
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type PostImageCreationAttributes = Optional<PostImageAttributes, 'id'>;

export class PostImage
  extends Model<PostImageAttributes, PostImageCreationAttributes>
  implements PostImageAttributes
{
  declare id: number;
  declare postId: number;
  declare url: string;
  declare publicId: string;
  declare order: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

PostImage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    publicId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'post_images',
    timestamps: true,
  }
);
