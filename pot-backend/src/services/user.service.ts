import { User } from '../models';
import { AppError } from '../utils/AppError';
import type { CreateUserDTO } from '../utils/user.schema';

export const userService = {
  async findAll() {
    return User.findAll();
  },

  async findById(id: number) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }
    return user;
  },

  async create(data: CreateUserDTO) {
    const existing = await User.findOne({ where: { email: data.email } });
    if (existing) {
      throw new AppError('Já existe um usuário com esse e-mail', 409);
    }
    // A senha é hasheada automaticamente pelo hook beforeSave do model
    return User.create({ ...data, role: data.role ?? 'user' });
  },

  async delete(id: number, requesterId: number) {
    if (id === requesterId) {
      throw new AppError('Você não pode excluir a própria conta', 400);
    }
    const user = await this.findById(id);
    await user.destroy();
  },
};
