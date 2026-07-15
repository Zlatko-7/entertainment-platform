import { Router } from "express";
import { getMoviesController } from "../controllers/movies.js";

const router = Router();
router.get("/", getMoviesController);

export default router;
