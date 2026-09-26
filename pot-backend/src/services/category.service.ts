import { Category, Piece } from '../models';
import { AppError } from '../utils/AppError';

interface CategoryInput {
  name: string;
}

export const categoryService = {
  async findAll() {
    return Category.findAll({ order: [['name', 'ASC']] });
  },

  async findById(id: number) {
    const category = await Category.findByPk(id);
    if (!category) {
      throw new AppError('Categoria não encontrada', 404);
    }
    return category;
  },

  async create(data: CategoryInput) {
    const existing = await Category.findOne({ where: { name: data.name } });
    if (existing) {
      throw new AppError('Já existe uma categoria com esse nome', 409);
    }
    return Category.create(data);
  },

  async update(id: number, data: CategoryInput) {
    const category = await this.findById(id);
    if (data.name !== category.name) {
      const existing = await Category.findOne({ where: { name: data.name } });
      if (existing) {
        throw new AppError('Já existe uma categoria com esse nome', 409);
      }
    }
    category.name = data.name;
    await category.save();
    return category;
  },

  async delete(id: number) {
    const category = await this.findById(id);
    // Impede apagar categoria em uso, pra não deixar peças órfãs.
    // Se preferir permitir e só desvincular, troque por Piece.update({categoryId: null}, ...)
    // e torne categoryId anulável no model.
    const piecesCount = await Piece.count({ where: { categoryId: id } });
    if (piecesCount > 0) {
      throw new AppError(
        `Não é possível excluir: existem ${piecesCount} peça(s) usando essa categoria`,
        409
      );
    }
    await category.destroy();
  },
};
