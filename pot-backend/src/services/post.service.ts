import { Post, PostImage, Piece, User, Category } from '../models';
import { AppError } from '../utils/AppError';
import { deleteFromCloudinary } from '../utils/cloudinaryUpload';

interface ImageInput {
  url: string;
  publicId: string;
}

interface CreatePostInput {
  authorId: number;
  pieceIds: number[];
  isActive?: boolean;
  images: ImageInput[];
}

interface UpdatePostInput {
  pieceIds?: number[];
  isActive?: boolean;
  images?: ImageInput[]; // se vier, SUBSTITUI todas as imagens do post
}

interface ListFilters {
  authorId?: number;
  isActive?: boolean;
}

const includeRelations = [
  { model: User, as: 'author', attributes: ['id', 'name'] },
  {
    model: PostImage,
    as: 'images',
    attributes: ['id', 'url', 'order'],
    separate: true,
    order: [['order', 'ASC']] as [string, string][],
  },
  {
    model: Piece,
    as: 'pieces',
    through: { attributes: [] }, // esconde as colunas da tabela de junção na resposta
    include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
  },
];

// Regra central pedida: só é possível usar no post peças que o PRÓPRIO
// autor do post cadastrou.
async function ensurePiecesBelongToAuthor(pieceIds: number[], authorId: number) {
  const pieces = await Piece.findAll({ where: { id: pieceIds, creatorId: authorId } });
  if (pieces.length !== pieceIds.length) {
    throw new AppError('Você só pode associar ao post peças criadas por você', 403);
  }
}

export const postService = {
  async findAll(filters: ListFilters) {
    const where: Record<string, unknown> = {};
    if (filters.authorId) where.authorId = filters.authorId;
    if (filters.isActive !== undefined) where.isActive = filters.isActive;

    return Post.findAll({ where, include: includeRelations, order: [['createdAt', 'DESC']] });
  },

  async findById(id: number) {
    const post = await Post.findByPk(id, { include: includeRelations });
    if (!post) {
      throw new AppError('Post não encontrado', 404);
    }
    return post;
  },

  async create(data: CreatePostInput) {
    await ensurePiecesBelongToAuthor(data.pieceIds, data.authorId);

    const post = await Post.create({ authorId: data.authorId, isActive: data.isActive ?? true });

    await PostImage.bulkCreate(
      data.images.map((img, index) => ({
        postId: post.id,
        url: img.url,
        publicId: img.publicId,
        order: index,
      }))
    );

    await post.addPieces(data.pieceIds);

    return this.findById(post.id);
  },

  async update(id: number, requesterId: number, data: UpdatePostInput) {
    const post = await Post.findByPk(id);
    if (!post) {
      throw new AppError('Post não encontrado', 404);
    }
    if (post.authorId !== requesterId) {
      throw new AppError('Você só pode editar posts criados por você', 403);
    }

    if (data.pieceIds) {
      await ensurePiecesBelongToAuthor(data.pieceIds, requesterId);
      await post.setPieces(data.pieceIds);
    }

    if (data.images) {
      const oldImages = await PostImage.findAll({ where: { postId: post.id } });
      await Promise.all(
        oldImages.map((img) => deleteFromCloudinary(img.publicId).catch(() => undefined))
      );
      await PostImage.destroy({ where: { postId: post.id } });
      await PostImage.bulkCreate(
        data.images.map((img, index) => ({
          postId: post.id,
          url: img.url,
          publicId: img.publicId,
          order: index,
        }))
      );
    }

    if (data.isActive !== undefined) {
      post.isActive = data.isActive;
      await post.save();
    }

    return this.findById(post.id);
  },

  async updateActive(id: number, requesterId: number, isActive: boolean) {
    const post = await Post.findByPk(id);
    if (!post) {
      throw new AppError('Post não encontrado', 404);
    }
    if (post.authorId !== requesterId) {
      throw new AppError('Você só pode alterar posts criados por você', 403);
    }
    post.isActive = isActive;
    await post.save();
    return this.findById(post.id);
  },

  async delete(id: number, requesterId: number) {
    const post = await Post.findByPk(id);
    if (!post) {
      throw new AppError('Post não encontrado', 404);
    }
    if (post.authorId !== requesterId) {
      throw new AppError('Você só pode excluir posts criados por você', 403);
    }

    const images = await PostImage.findAll({ where: { postId: post.id } });
    await Promise.all(images.map((img) => deleteFromCloudinary(img.publicId).catch(() => undefined)));

    // onDelete: CASCADE nas associações já apaga post_images e post_pieces
    await post.destroy();
  },
};
