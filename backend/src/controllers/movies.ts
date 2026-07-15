import { Request, Response } from "express";
import { getMoives } from "../services/get-movies-service.js";

export async function getMoviesController(req: Request, res: Response) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";

    const result = await getMoives({ page, limit, search });

    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
