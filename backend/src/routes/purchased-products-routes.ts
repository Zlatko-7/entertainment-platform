import { Router } from "express";
import { purchasedItems } from "../controllers/purchased-items.js";
import { isAuthenticated } from "../middleware/auth-middleware.js";

const router = Router();
router.get("/", isAuthenticated, purchasedItems);

export default router;
