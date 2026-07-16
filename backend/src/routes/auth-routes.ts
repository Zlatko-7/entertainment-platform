import { Router } from "express";
import { signupController } from "../controllers/signup.js";
import { loginController } from "../controllers/login.js";
import { logoutController } from "../controllers/logout.js";
import { isAuthenticated } from "../middleware/auth-middleware.js";
import { getMeController } from "../controllers/me.js";
import { refreshTokenController } from "../controllers/refresh-token.js";
import { getMoviesController } from "../controllers/movies.js";

const router = Router();

router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/refresh-token", refreshTokenController);
router.post("/logout", isAuthenticated, logoutController);
router.get("/me", isAuthenticated, getMeController);
router.get("/get-movies", getMoviesController);

export default router;
