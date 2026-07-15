import { Router } from "express";
import { purchasedItemsController } from "../controllers/purchased-items.js";
import { isAuthenticated } from "../middleware/auth-middleware.js";

const router = Router();
router.get("/", isAuthenticated, purchasedItemsController);

export default router;
