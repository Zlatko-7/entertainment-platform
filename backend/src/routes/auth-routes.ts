import { Router } from "express";
import { signupController } from "../controllers/signup.js";
import { loginController } from "../controllers/login.js";
import { logoutController } from "../controllers/logout.js";
import { isAuthenticated } from "../middleware/auth-middleware.js";
import { getMeController } from "../controllers/me.js";
import { refreshTokenController } from "../controllers/refresh-token.js";
import { authRateLimiter } from "../middleware/rate-limit.js";

const router = Router();

router.post("/signup", authRateLimiter, signupController);
router.post("/login", authRateLimiter, loginController);
router.post("/refresh-token", authRateLimiter, refreshTokenController);
router.post("/logout", isAuthenticated, logoutController);
router.get("/me", isAuthenticated, getMeController);

export default router;
