import { Piece, Category, User } from '../models';
import { AppError } from '../utils/AppError';
import { deleteFromCloudinary } from '../utils/cloudinaryUpload';

interface CreatePieceInput {
  description: string;
  link?: string;
  size: string;
  categoryId: number;
  creatorId: number;
  photoUrl: string;
  photoPublicId: string;
}

interface UpdatePieceInput {
  description?: string;
  link?: string;
  size?: string;
  categoryId?: number;
  photoUrl?: string;
  photoPublicId?: string;
}

interface ListFilters {
  categoryId?: number;
  creatorId?: number;
}

// Sempre trazemos o nome do criador e da categoria junto, pra não precisar
// de N+1 requisições no front
const includeRelations = [
  { model: User, as: 'creator', attributes: ['id', 'name'] },
  { model: Category, as: 'category', attributes: ['id', 'name'] },
];

async function ensureCategoryExists(categoryId: number) {
  const category = await Category.findByPk(categoryId);
  if (!category) {
    throw new AppError('Categoria informada não existe', 422);
  }
}

export const pieceService = {
  async findAll(filters: ListFilters) {
    const where: ListFilters = {};
    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.creatorId) where.creatorId = filters.creatorId;

    return Piece.findAll({ include: includeRelations, order: [['createdAt', 'DESC']] });
  },

  async findById(id: number) {
    const piece = await Piece.findByPk(id, { include: includeRelations });
    if (!piece) {
      throw new AppError('Peça não encontrada', 404);
    }
    return piece;
  },

  async create(data: CreatePieceInput) {
    await ensureCategoryExists(data.categoryId);
    const piece = await Piece.create(data);
    return this.findById(piece.id);
  },

  async update(id: number, requesterId: number, data: UpdatePieceInput) {
    const piece = await Piece.findByPk(id);
    if (!piece) {
      throw new AppError('Peça não encontrada', 404);
    }
    if (piece.creatorId !== requesterId) {
      throw new AppError('Você só pode editar peças criadas por você', 403);
    }
    if (data.categoryId) {
      await ensureCategoryExists(data.categoryId);
    }

    // Se uma foto nova foi enviada, apaga a antiga do Cloudinary pra não
    // acumular lixo na conta. Se a exclusão falhar lá, não travamos a edição.
    if (data.photoUrl && piece.photoPublicId) {
      await deleteFromCloudinary(piece.photoPublicId).catch(() => undefined);
    }

    await piece.update(data);
    return this.findById(piece.id);
  },

  async updateAvailability(id: number, requesterId: number, available: boolean) {
    const piece = await Piece.findByPk(id);
    if (!piece) {
      throw new AppError('Peça não encontrada', 404);
    }
    if (piece.creatorId !== requesterId) {
      throw new AppError('Você só pode alterar a disponibilidade de peças criadas por você', 403);
    }
    piece.available = available;
    await piece.save();
    return this.findById(piece.id);
  },

  async delete(id: number, requesterId: number) {
    const piece = await Piece.findByPk(id);
    if (!piece) {
      throw new AppError('Peça não encontrada', 404);
    }
    if (piece.creatorId !== requesterId) {
      throw new AppError('Você só pode excluir peças criadas por você', 403);
    }
    if (piece.photoPublicId) {
      await deleteFromCloudinary(piece.photoPublicId).catch(() => undefined);
    }
    await piece.destroy();
  },
};
