import { Router } from "express";
import { signup } from "../controllers/signup.js";
import { login } from "../controllers/login.js";
import { logout } from "../controllers/logout.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { getMe } from "../controllers/me.js";
import { refresh } from "../controllers/refreshToken.js";
import { getMovies } from "../controllers/movies.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
// CURSOR: /refresh-token HAS NO isAuthenticated — IT USES refreshToken COOKIE ONLY
router.post("/refresh-token", refresh);
router.post("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated, getMe);
router.get("/get-movies", getMovies);

export default router;
