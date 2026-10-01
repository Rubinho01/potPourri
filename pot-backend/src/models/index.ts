import { User } from './user.model';
import { RefreshToken } from './refreshToken.model';
import { Category } from './category.model';
import { Piece } from './piece.model';
import { Post } from './post.model';
import { PostImage } from './postImage.model';
import { PostPiece } from './postPiece.model';

User.hasMany(RefreshToken, { foreignKey: 'userId', onDelete: 'CASCADE' });
RefreshToken.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Piece, { foreignKey: 'creatorId', onDelete: 'CASCADE' });
Piece.belongsTo(User, { foreignKey: 'creatorId', as: 'creator' });

Category.hasMany(Piece, { foreignKey: 'categoryId', onDelete: 'RESTRICT' });
Piece.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// Post: autor (1:N) e imagens (1:N)
User.hasMany(Post, { foreignKey: 'authorId', onDelete: 'CASCADE' });
Post.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

Post.hasMany(PostImage, { foreignKey: 'postId', onDelete: 'CASCADE', as: 'images' });
PostImage.belongsTo(Post, { foreignKey: 'postId' });

// Post <-> Piece é N:N, via a tabela de junção post_pieces
Post.belongsToMany(Piece, { through: PostPiece, foreignKey: 'postId', otherKey: 'pieceId', as: 'pieces' });
Piece.belongsToMany(Post, { through: PostPiece, foreignKey: 'pieceId', otherKey: 'postId', as: 'posts' });

export { User, RefreshToken, Category, Piece, Post, PostImage, PostPiece };
