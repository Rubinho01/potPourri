import { User } from '../models';
import { AppError } from '../utils/AppError';

interface CreateUserInput {
  name: string;
  email: string;
}

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

  async create(data: CreateUserInput) {
    const existing = await User.findOne({ where: { email: data.email } });
    if (existing) {
      throw new AppError('Já existe um usuário com esse e-mail', 409);
    }
    return User.create(data);
  },

  async delete(id: number) {
    const user = await this.findById(id);
    await user.destroy();
  },
};
