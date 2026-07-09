import { Router } from "express";
import { orderHistory } from "../controllers/оrder-history.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = Router();
router.get("/", isAuthenticated, orderHistory);

export default router;
