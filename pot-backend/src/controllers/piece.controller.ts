import { Request, Response } from 'express';
import { pieceService } from '../services/piece.service';
import { createPieceSchema, updatePieceSchema } from '../utils/piece.schema';
import { AppError } from '../utils/AppError';
import { uploadBufferToCloudinary } from '../utils/cloudinaryUpload';

const CLOUDINARY_FOLDER = 'pecas-moda';

export const pieceController = {
  async list(req: Request, res: Response) {
    const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
    const creatorId = req.query.creatorId ? Number(req.query.creatorId) : undefined;
    const pieces = await pieceService.findAll({ categoryId, creatorId });
    res.json(pieces);
  },

  async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw new AppError('Id inválido', 400);
    }
    const piece = await pieceService.findById(id);
    res.json(piece);
  },

  async create(req: Request, res: Response) {
    const parsed = createPieceSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(parsed.error.issues[0].message, 422);
    }
    if (!req.file) {
      throw new AppError('A foto da peça é obrigatória (campo "photo")', 422);
    }

    const uploaded = await uploadBufferToCloudinary(req.file.buffer, CLOUDINARY_FOLDER);

    const piece = await pieceService.create({
      description: parsed.data.description,
      size: parsed.data.size,
      categoryId: parsed.data.categoryId,
      link: parsed.data.link || undefined,
      creatorId: req.user!.id,
      photoUrl: uploaded.url,
      photoPublicId: uploaded.publicId,
    });

    res.status(201).json(piece);
  },

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw new AppError('Id inválido', 400);
    }

    const parsed = updatePieceSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(parsed.error.issues[0].message, 422);
    }

    let photoData: { photoUrl?: string; photoPublicId?: string } = {};
    if (req.file) {
      const uploaded = await uploadBufferToCloudinary(req.file.buffer, CLOUDINARY_FOLDER);
      photoData = { photoUrl: uploaded.url, photoPublicId: uploaded.publicId };
    }

    const piece = await pieceService.update(id, req.user!.id, {
      ...parsed.data,
      link: parsed.data.link || undefined,
      ...photoData,
    });

    res.json(piece);
  },

  async remove(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw new AppError('Id inválido', 400);
    }
    await pieceService.delete(id, req.user!.id);
    res.status(204).send();
  },
};
