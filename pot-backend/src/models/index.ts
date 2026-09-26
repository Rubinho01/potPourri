import { User } from './user.model';
import { RefreshToken } from './refreshToken.model';
import { Category } from './category.model';
import { Piece } from './piece.model';

User.hasMany(RefreshToken, { foreignKey: 'userId', onDelete: 'CASCADE' });
RefreshToken.belongsTo(User, { foreignKey: 'userId' });

// Um usuário pode ter várias peças; cada peça tem um único criador
User.hasMany(Piece, { foreignKey: 'creatorId', onDelete: 'CASCADE' });
Piece.belongsTo(User, { foreignKey: 'creatorId', as: 'creator' });

// Uma categoria pode ter várias peças; RESTRICT impede apagar categoria em uso
// no nível do banco (o service também confere isso e devolve um erro 409 amigável)
Category.hasMany(Piece, { foreignKey: 'categoryId', onDelete: 'RESTRICT' });
Piece.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

export { User, RefreshToken, Category, Piece };
