import { Request, Response } from 'express';
import { postService } from '../services/post.service';
import { createPostSchema, updatePostSchema, updatePostActiveSchema } from '../utils/post.schema';
import { AppError } from '../utils/AppError';
import { uploadBufferToCloudinary } from '../utils/cloudinaryUpload';

const CLOUDINARY_FOLDER = 'posts';
const MIN_IMAGES = 1;
const MAX_IMAGES = 3;

async function uploadImages(files: Express.Multer.File[]) {
  return Promise.all(files.map((file) => uploadBufferToCloudinary(file.buffer, CLOUDINARY_FOLDER)));
}

export const postController = {
  async list(req: Request, res: Response) {
    const authorId = req.query.authorId ? Number(req.query.authorId) : undefined;
    const isActive = req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined;
    const posts = await postService.findAll({ authorId, isActive });
    res.json(posts);
  },

  async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw new AppError('Id inválido', 400);
    }
    const post = await postService.findById(id);
    res.json(post);
  },

  async create(req: Request, res: Response) {
    const parsed = createPostSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(parsed.error.issues[0].message, 422);
    }

    const files = (req.files as Express.Multer.File[] | undefined) ?? [];
    if (files.length < MIN_IMAGES || files.length > MAX_IMAGES) {
      throw new AppError(`Envie de ${MIN_IMAGES} a ${MAX_IMAGES} imagens (campo "images")`, 422);
    }

    const images = await uploadImages(files);

    const post = await postService.create({
      authorId: req.user!.id,
      pieceIds: parsed.data.pieceIds,
      isActive: parsed.data.isActive,
      images,
    });

    res.status(201).json(post);
  },

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw new AppError('Id inválido', 400);
    }

    const parsed = updatePostSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(parsed.error.issues[0].message, 422);
    }

    const files = (req.files as Express.Multer.File[] | undefined) ?? [];
    let images;
    if (files.length > 0) {
      if (files.length > MAX_IMAGES) {
        throw new AppError(`No máximo ${MAX_IMAGES} imagens por post`, 422);
      }
      images = await uploadImages(files);
    }

    const post = await postService.update(id, req.user!.id, {
      pieceIds: parsed.data.pieceIds,
      isActive: parsed.data.isActive,
      images,
    });

    res.json(post);
  },

  async updateActive(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw new AppError('Id inválido', 400);
    }
    const parsed = updatePostActiveSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(parsed.error.issues[0].message, 422);
    }
    const post = await postService.updateActive(id, req.user!.id, parsed.data.isActive);
    res.json(post);
  },

  async remove(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw new AppError('Id inválido', 400);
    }
    await postService.delete(id, req.user!.id);
    res.status(204).send();
  },
};
