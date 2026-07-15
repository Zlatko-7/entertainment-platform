import { Router } from "express";
import { signup } from "../controllers/signup.js";
import { login } from "../controllers/login.js";
import { logout } from "../controllers/logout.js";
import { isAuthenticated } from "../middleware/auth-middleware.js";
import { getMeController } from "../controllers/me.js";
import { refresh } from "../controllers/refresh-token.js";
import { getMoviesController } from "../controllers/movies.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
//  /refresh-token HAS NO isAuthenticated — IT USES refreshToken COOKIE ONLY
router.post("/refresh-token", refresh);
router.post("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated, getMeController);
router.get("/get-movies", getMoviesController);

export default router;
