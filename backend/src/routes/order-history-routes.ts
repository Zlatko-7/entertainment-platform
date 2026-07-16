import { Router } from "express";
import { orderHistoryController } from "../controllers/order-history.js";
import { isAuthenticated } from "../middleware/auth-middleware.js";

const router = Router();
router.get("/", isAuthenticated, orderHistoryController);

export default router;
