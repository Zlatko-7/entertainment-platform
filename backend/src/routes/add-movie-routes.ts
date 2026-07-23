import { Router } from "express";
import { createMovieController } from "../controllers/create-movie.js";
import { isAdmin } from "../middleware/admin-middleware.js";
import { isAuthenticated } from "../middleware/auth-middleware.js";
import { uploadPoster } from "../middleware/upload-middleware.js";

const router = Router();

router.post(
  "/",
  isAuthenticated,
  isAdmin,
  uploadPoster,
  createMovieController
);

export default router;
