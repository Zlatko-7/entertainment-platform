import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error.js";
import { createMovieSchema } from "../schemas/create-movie-schema.js";
import { createMovieService } from "../services/create-movie-service.js";

function publicBaseUrl(req: Request) {
  if (process.env.API_PUBLIC_URL) {
    return process.env.API_PUBLIC_URL.replace(/\/$/, "");
  }
  return `${req.protocol}://${req.get("host")}`;
}

export async function createMovieController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    if (!req.file) {
      throw new AppError("Poster image is required", 400);
    }

    const fields = createMovieSchema.parse(req.body);
    const posterUrl = `${publicBaseUrl(req)}/uploads/posters/${req.file.filename}`;

    const movie = await createMovieService({
      title: fields.title,
      year: fields.year,
      director: fields.director,
      rating: fields.rating,
      genre: fields.genre,
      actors: fields.cast,
      synopsis: fields.synopsis,
      posterUrl,
      price: fields.price,
      createdBy: req.user.id,
    });

    return res.status(201).json(movie);
  } catch (error) {
    return next(error);
  }
}
