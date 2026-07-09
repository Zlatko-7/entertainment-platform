import { Router } from "express";
import { getMovies } from "../controllers/movies.js";

const router = Router();
router.get("/", getMovies);

export default router;
