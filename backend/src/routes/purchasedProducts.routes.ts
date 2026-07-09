import { Router } from "express";
import { purchasedItems } from "../controllers/purchasedItems.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = Router();
router.get("/", isAuthenticated, purchasedItems);

export default router;
